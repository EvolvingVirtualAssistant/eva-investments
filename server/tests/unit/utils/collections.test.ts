import {
  assertEquals,
  assertToBeLessThanOrEqual,
  assertUndefined,
  test
} from '../../wrap/testWrapper';
import {
  getNewOrderedDoublyLinkedSet,
  OrderedDoublyLinkedSet
} from '../../../src/utils/collections';

const inverseCompareFn = (element1: number, element2: number) => {
  if (element1 > element2) {
    return -1;
  }

  return element1 < element2 ? 1 : 0;
};

test('Should add to head and tail when OrderedDoublyLinkedSet is empty', () => {
  const set: OrderedDoublyLinkedSet<number> =
    getNewOrderedDoublyLinkedSet(inverseCompareFn);

  assertEquals(set.length, 0);
  assertUndefined(set.head);
  assertUndefined(set.tail);

  const idx = set.add('2', 2);
  assertEquals(set.length, 1);
  assertEquals(idx, 0);
  assertEquals(set.head?.value, 2);
  assertEquals(set.tail?.value, 2);

  assertUndefined(set.head?.previous);
  assertUndefined(set.head?.next);
  assertUndefined(set.tail?.previous);
  assertUndefined(set.tail?.next);
});

test('Should add to head when element has the highest value in an inverted OrderedDoublyLinkedSet', () => {
  const set: OrderedDoublyLinkedSet<number> =
    getNewOrderedDoublyLinkedSet(inverseCompareFn);

  set.add('3', 3);
  assertEquals(set.length, 1);
  assertEquals(set.head?.value, 3);
  assertEquals(set.tail?.value, 3);

  const idx = set.add('6', 6);
  assertEquals(set.length, 2);
  assertEquals(idx, 0);
  assertEquals(set.head?.value, 6);
  assertEquals(set.tail?.value, 3);

  assertEquals(set.head?.next?.value, 3);
  assertEquals(set.tail?.previous?.value, 6);
});

test('Should add to tail when element has the lowest value in an inverted OrderedDoublyLinkedSet', () => {
  const set: OrderedDoublyLinkedSet<number> =
    getNewOrderedDoublyLinkedSet(inverseCompareFn);

  set.add('3', 3);
  set.add('2', 2);
  set.add('5', 5);
  assertEquals(set.length, 3);
  assertEquals(set.head?.value, 5);
  assertEquals(set.tail?.value, 2);

  const idx = set.add('1', 1);
  assertEquals(set.length, 4);
  assertEquals(idx, 3);
  assertEquals(set.head?.value, 5);
  assertEquals(set.tail?.value, 1);

  assertEquals(set.head?.next?.value, 3);
  assertEquals(set.tail?.previous?.value, 2);
});

test('Should add in the middle when element does not have the lowest or highest value in an inverted OrderedDoublyLinkedSet', () => {
  const set: OrderedDoublyLinkedSet<number> =
    getNewOrderedDoublyLinkedSet(inverseCompareFn);

  set.add('3', 3);
  set.add('5', 5);
  assertEquals(set.length, 2);
  assertEquals(set.head?.value, 5);
  assertEquals(set.tail?.value, 3);

  const idx = set.add('4', 4);
  assertEquals(set.length, 3);
  assertEquals(idx, 1);
  assertEquals(set.head?.value, 5);
  assertEquals(set.tail?.value, 3);

  assertEquals(set.head?.next?.value, 4);
  assertEquals(set.tail?.previous?.value, 4);
});

test('Should add in the middle overriding same element when element does not have the lowest or highest value and already exists in an inverted OrderedDoublyLinkedSet', () => {
  const set: OrderedDoublyLinkedSet<number> =
    getNewOrderedDoublyLinkedSet(inverseCompareFn);

  set.add('3', 3);
  set.add('7', 7);
  set.add('4', 4);
  assertEquals(set.length, 3);
  assertEquals(set.head?.value, 7);
  assertEquals(set.tail?.value, 3);

  //value 5 is intentional. The key is what makes an element unique
  const idx = set.add('4', 5);
  assertEquals(set.length, 3);
  assertEquals(idx, 1);
  assertEquals(set.head?.value, 7);
  assertEquals(set.tail?.value, 3);

  assertEquals(set.head?.next?.value, 5);
  assertEquals(set.tail?.previous?.value, 5);
});

test('Should not add element if maxSize has been reached and element has the lowest value an inverted OrderedDoublyLinkedSet', () => {
  const set: OrderedDoublyLinkedSet<number> = getNewOrderedDoublyLinkedSet(
    inverseCompareFn,
    5
  );

  set.add('3', 3);
  set.add('7', 7);
  set.add('4', 4);
  set.add('9', 9);
  set.add('5', 5);
  assertEquals(set.length, 5);
  assertEquals(set.head?.value, 9);
  assertEquals(set.tail?.value, 3);

  const idx = set.add('1', 1);
  assertEquals(set.length, 5);
  assertEquals(idx, -1);
  assertEquals(set.head?.value, 9);
  assertEquals(set.tail?.value, 3);

  assertEquals(set.head?.next?.value, 7);
  assertEquals(set.tail?.previous?.value, 4);
});

test('Should add element and remove element in tail if maxSize has been reached and element does not have the lowest or the highest value an inverted OrderedDoublyLinkedSet', () => {
  const set: OrderedDoublyLinkedSet<number> = getNewOrderedDoublyLinkedSet(
    inverseCompareFn,
    5
  );

  set.add('3', 3);
  set.add('7', 7);
  set.add('4', 4);
  set.add('9', 9);
  set.add('5', 5);
  assertEquals(set.length, 5);
  assertEquals(set.head?.value, 9);
  assertEquals(set.tail?.value, 3);

  const idx = set.add('6', 6);
  assertEquals(set.length, 5);
  assertEquals(idx, 2);
  assertEquals(set.head?.value, 9);
  assertEquals(set.tail?.value, 4);

  assertEquals(set.head?.next?.value, 7);
  assertEquals(set.tail?.previous?.value, 5);
});

test('Should remove element from a OrderedDoublyLinkedSet', () => {
  const set: OrderedDoublyLinkedSet<number> =
    getNewOrderedDoublyLinkedSet(inverseCompareFn);

  set.add('3', 3);
  set.add('7', 7);
  set.add('4', 4);
  assertEquals(set.length, 3);
  assertEquals(set.head?.value, 7);
  assertEquals(set.tail?.value, 3);

  const element = set.remove('4');
  assertEquals(set.length, 2);
  assertEquals(element, 4);
  assertEquals(set.head?.value, 7);
  assertEquals(set.tail?.value, 3);

  assertEquals(set.head?.next?.value, 3);
  assertEquals(set.tail?.previous?.value, 7);
});

test('Should support a big number of elements using OrderedDoublyLinkedSet', () => {
  const maxSize = 4096;
  const set: OrderedDoublyLinkedSet<number> = getNewOrderedDoublyLinkedSet(
    inverseCompareFn,
    maxSize
  );

  let i: number;
  let randomNumber: number;
  const min = 0.000101532;
  const max = 0.0016774129;
  for (i = 0; i < maxSize + 10; i++) {
    randomNumber = getRandomArbitrary(min, max);
    set.add(i + '', randomNumber);
  }

  assertEquals(set.length, maxSize);

  randomNumber = getRandomArbitrary(min, max);
  const startTime = Date.now();
  const idx = set.add(randomNumber + '', randomNumber);
  const duration = Date.now() - startTime;
  console.log(
    `Added element ${randomNumber} in position ${idx} in ${duration}ms`
  );

  let node = set.head;
  let length = 0;
  do {
    assertToBeLessThanOrEqual(node?.next?.value || -1, node!.value);
    node = node?.next;
    length++;
  } while (node);

  assertEquals(length, set.length);
});

const getRandomArbitrary = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const printSet = (set: OrderedDoublyLinkedSet<number>): void => {
  const setValues: number[] = [];
  let node = set.head;
  do {
    setValues.push(node?.value || -1);
    node = node?.next;
  } while (node);
  console.log(setValues);
};
