import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std/testing/asserts.ts';
import { tokenizer } from '../../../../../src/libs/cli/utils/parser.ts';
import { CliError } from '../../../../../src/libs/cli/errors/cliError.ts';
import { ParserConstants } from '../../../../../src/libs/cli/constants/cliConstants.ts';

Deno.test('Should tokenize string', () => {
  ParserConstants.TOKEN_DELIMITERS.forEach((pairDelimiter) => {
    const startDel = pairDelimiter.START_DELIMITER;
    const endDel = pairDelimiter.END_DELIMITER;
    const tokens = tokenizer(`This ${startDel}is a${endDel} test`);

    assertEquals(tokens.length, 3);
  });
});

Deno.test('Should return empty array on empty string', () => {
  const tokens = tokenizer('');
  assertEquals(tokens.length, 0);
});

Deno.test('Should return empty array on blank string', () => {
  const tokens = tokenizer('       ');
  assertEquals(tokens.length, 0);
});

Deno.test('Should split string by spaces', () => {
  const tokens = tokenizer('This is a test');

  assertEquals(tokens.length, 4);
  assertEquals(tokens[0], 'This');
  assertEquals(tokens[1], 'is');
  assertEquals(tokens[2], 'a');
  assertEquals(tokens[3], 'test');
});

Deno.test(
  'Should throw error on different number of start and end delimiters',
  () => {
    ParserConstants.TOKEN_DELIMITERS.forEach((pairDelimiter) => {
      const startDel = pairDelimiter.START_DELIMITER;
      const endDel = pairDelimiter.END_DELIMITER;

      assertThrows(
        () => tokenizer(`This ${startDel}is${endDel} ${startDel}a test`),
        CliError,
        ParserConstants.UNMATCHING_NUM_DELIMITERS_ERROR(startDel, endDel)
      );
    });
  }
);

Deno.test(
  'Should throw error on starting delimiter after end delimiter',
  () => {
    ParserConstants.TOKEN_DELIMITERS.forEach((pairDelimiter) => {
      const startDel = pairDelimiter.START_DELIMITER;
      const endDel = pairDelimiter.END_DELIMITER;

      assertThrows(
        () => tokenizer(`This${endDel} ${startDel}is a test`),
        CliError,
        ParserConstants.START_POS_SUPERIOR_TO_INFERIOR_POS_DELIMITERS_ERROR(
          startDel,
          endDel
        )
      );
    });
  }
);
