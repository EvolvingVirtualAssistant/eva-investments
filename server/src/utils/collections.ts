import { Dictionary } from '../types/types';

//https://stackoverflow.com/questions/57760111/javascript-map-find-at-the-same-time-findmap
function* map<T, R>(collection: T[], fn: (item: T) => R) {
  for (const item of collection) {
    yield fn(item);
  }
}

function find<T, R>(
  collection: Generator<T, R, unknown>,
  predicate: (item: any) => boolean
) {
  for (const item of collection) {
    if (predicate(item)) {
      return item;
    }
  }
}

export const lazyMapFind = <T, R>(
  collection: T[],
  mapper: (item: T) => R,
  predicate: (item: R) => boolean
) => find(map(collection, mapper), predicate);

export interface DoublyLinkedNode<T> {
  previous?: DoublyLinkedNode<T>;
  value: T;
  next?: DoublyLinkedNode<T>;
}
export interface OrderedDoublyLinkedSet<T> {
  head?: DoublyLinkedNode<T>;
  tail?: DoublyLinkedNode<T>;
  add: (key: string, element: T) => number; //idx where element was inserted
  remove: (key: string) => T | undefined;
  length: number;
  maxSize?: number;
}

export const getNewOrderedDoublyLinkedSet = <T>(
  compare: (element1: T, element2: T) => number,
  maxSize?: number
): OrderedDoublyLinkedSet<T> => {
  const elementsDictionary: Dictionary<DoublyLinkedNode<T>> = {};

  const list: OrderedDoublyLinkedSet<T> = {
    head: undefined,
    tail: undefined,
    length: 0,
    maxSize,
    add: (key: string, element: T): number => {
      const node: DoublyLinkedNode<T> = {
        previous: undefined,
        value: element,
        next: undefined
      };

      if (!list.head) {
        list.head = node;
        list.tail = node;
        elementsDictionary[key] = node;
        list.length = list.length + 1;
        return 0;
      }

      list.remove(key); // will check for element and if it exists, removes element

      let comparisonResult: number;
      let currNode: DoublyLinkedNode<T> = list.head;
      let idx = 0;
      do {
        comparisonResult = compare(currNode.value, node.value);

        //found where to insert node
        if (comparisonResult > 0) {
          node.previous = currNode.previous;
          if (currNode.previous) {
            currNode.previous.next = node;
          }
          node.next = currNode;
          currNode.previous = node;
        } else if (maxSize != null && idx + 1 >= maxSize) {
          return -1; //Can not add element because it exceeds the max allowed size
        } else if (!currNode.next) {
          //node will be the tail
          currNode.next = node;
          node.previous = currNode;
          comparisonResult = 1;
          idx += 1;
        } else {
          //need to keep iterating
          currNode = currNode.next;
          idx += 1;
        }
      } while (comparisonResult < 1);

      if (!node.previous) {
        list.head = node;
      }

      if (!node.next) {
        list.tail = node;
      }

      //adds element to dictionary
      elementsDictionary[key] = node;

      //discards last element in case list is full
      if (list.length === list.maxSize) {
        list.tail = list.tail!.previous;
        list.tail!.next = undefined;
      }

      list.length =
        list.length === list.maxSize ? list.length : list.length + 1;
      return idx;
    },
    remove: (key: string): T | undefined => {
      const node = elementsDictionary[key];

      if (!node) {
        return undefined;
      }

      if (node.previous) {
        node.previous.next = node.next;
      } else {
        list.head = node.next;
        if (list.head) {
          list.head.previous = undefined;
        }
      }

      if (node.next) {
        node.next.previous = node.previous;
      } else {
        list.tail = node.previous;
        if (list.tail) {
          list.tail.next = undefined;
        }
      }

      delete elementsDictionary[key];
      list.length = list.length > 0 ? list.length - 1 : 0;
      return node.value;
    }
  };
  return list;
};
