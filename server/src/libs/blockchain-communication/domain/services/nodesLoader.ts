import { NodesConfigRepository } from '../../driven/repositories/nodesConfigRepository';
import { NodesRepository } from '../../driven/repositories/nodesRepository';
import { NodeError } from '../../errors/nodeError';
import { Node } from '../entities/node';
import { NodeAuth } from '../entities/nodeAuth';
import { NodeOptions } from '../entities/nodeOptions';

export function loadNodes(
  nodesConfigRepository: NodesConfigRepository,
  nodesRepository: NodesRepository
) {
  const nodesOptions = nodesConfigRepository.getNodesOptions();
  const nodesAuth = nodesConfigRepository.getNodesAuth();

  const newNodes = createNodes(nodesOptions, nodesAuth);

  // TODO:
  // - May want to store these somewhere else before deleting, as history to help with taking decisions in the future
  // - May want to store node options (minus the host), and add an id to each one of them, which would help with:
  //   - avoiding data duplication
  //   - able to associate easily an identifiable options with other stats as times, speed, ..., which can be common to different hosts
  nodesRepository.deleteAll();
  nodesRepository.saveAll(newNodes);
}

function createNodes(
  nodesOptions: NodeOptions[],
  nodesAuth: NodeAuth[]
): Node[] {
  const nodes: Node[] = [];

  nodesOptions.forEach((opt, idx) => {
    checkForDuplicates(nodesOptions, opt, idx);

    const nodeIndex = findNodesIndexByUrl(nodes, opt.host);

    if (nodeIndex < 0) {
      nodes.push({ id: nodes.length, url: opt.host, options: [opt] });
    } else {
      nodes[nodeIndex].options.push(opt);
    }
  });

  nodesAuth.forEach((auth, idx) => {
    checkForDuplicates(nodesAuth, auth, idx);
    checkForMissingHostsInNodesOptions(nodesOptions, auth.url);

    const nodeIndex = findNodesIndexByUrl(nodes, auth.url);

    // At this point (due to checkForMissingHostsInNodesOptions and the previous loop)
    // nodeIndex should always be valid
    if (nodes[nodeIndex].apiKey != null) {
      nodes.push({
        ...nodes[nodeIndex],
        id: nodes.length,
        apiKey: auth.apiKey
      });
    } else {
      nodes[nodeIndex].apiKey = auth.apiKey;
    }
  });

  return nodes;
}

function checkForDuplicates<T>(collection: T[], obj1: T, idx1: number): void {
  if (
    collection.some((obj2, idx2) => idx1 !== idx2 && deepEquals(obj1, obj2))
  ) {
    throw new NodeError(
      `Duplicated element ${obj1} found in node config collection`
    );
  }
}

function checkForMissingHostsInNodesOptions(
  nodeOptions: NodeOptions[],
  url: string
): void {
  if (!nodeOptions.some((opt) => opt.host === url)) {
    throw new NodeError(
      `Host ${url} found in node auth collection but not in node options collection`
    );
  }
}

function findNodesIndexByUrl(nodes: Node[], url: string) {
  return nodes.findIndex((node) => node.url === url);
}

function deepEquals(obj1: unknown, obj2: unknown): boolean {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    return (
      obj1.length === obj2.length &&
      obj1.every((o1) => obj2.some((o2) => deepEquals(o1, o2))) &&
      obj2.every((o2) => obj1.some((o1) => deepEquals(o1, o2)))
    );
  } else if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    const obj1Props = Object.getOwnPropertyNames(obj1);
    const obj2Props = Object.getOwnPropertyNames(obj2);

    return (
      obj1Props.length === obj2Props.length &&
      obj1Props.every((prop1) =>
        obj2Props.some(
          (prop2) =>
            prop1 === prop2 &&
            deepEquals((obj1 as any)[prop1], (obj2 as any)[prop2])
        )
      ) &&
      obj2Props.every((prop2) =>
        obj1Props.some(
          (prop1) =>
            prop1 === prop2 &&
            deepEquals((obj1 as any)[prop1], (obj2 as any)[prop2])
        )
      )
    );
  } else if (typeof obj1 === 'string' && typeof obj2 === 'string') {
    return obj1?.trim() === obj2?.trim();
  }

  return obj1 === obj2;
}
