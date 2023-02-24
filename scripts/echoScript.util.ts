/*
  Copyright 2022. Whatssub co.,Ltd.
  All rights reserved.
*/

/**
 * 스타일 적용을 위한 시작 구문
 */
const init = '\u001b[';

/**
 * 스타일 적용을 위한 종료 구문
 */
const end = 'm';

/**
 * 주어진 파라미터 값으로 콘솔 텍스트에 스타일 값을 부여합니다. 부여 후, 리셋 코드까지 제공합니다.
 *
 * @param text 꾸밀 텍스트
 * @param options 옵션 값. 복수인 경우 배열로 입력
 * @returns 꾸며진 텍스트 값. 이후 리셋 됩니다.
 */
export function styleConsole(text: string, options: ConsoleStyle | ConsoleStyle[]): string {
  const styler = init + (Array.isArray(options) ? options.join(';') : options) + end;
  const reset = init + ConsoleStyle.Reset + end;

  return styler + text + reset;
}

/**
 * 각 스타일 값의 옵션
 */
export enum ConsoleStyle {
  /**
   * 기본 값
   *
   * 모든 옵션을 해제합니다.
   */
  Reset = '0',

  /**
   * 볼드
   *
   * 두껍게 표시합니다.
   */
  Bold = '1',

  /**
   * 이탤릭
   *
   * 글자를 기울여 표시합니다.
   */
  Italic = '3',

  /**
   * 밑줄
   *
   * 글자에 밑줄을 추가합니다.
   */
  Underline = '4',

  /**
   * 색상 - 검정
   */
  Black = '30',

  /**
   * 색상 - 빨강
   */
  Red = '31',

  /**
   * 색상 - 초록
   */
  Green = '32',

  /**
   * 색상 - 노랑
   */
  Yellow = '33',

  /**
   * 색상 - 파랑
   */
  Blue = '34',

  /**
   * 색상 - 보라
   */
  Purple = '35',

  /**
   * 색상 - 시안
   */
  Cyan = '36',

  /**
   * 색상 - 하양
   */
  White = '37',
}
