/*
  Copyright 2023 Taeyoon Lee
  All rights reserved.
*/

import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

/* 파일명 및 경로 설정 */
const README_FILE = path.resolve(__dirname, '../README.md');
const RESOURCES_DIR_NAME = path.resolve('resources')
const RESOURCES_DIR = path.resolve(__dirname, RESOURCES_DIR_NAME)
const README_PRESET_FILE = path.resolve(RESOURCES_DIR, './README.preset.md')
const WHATSSUB_FILE = path.resolve(RESOURCES_DIR, './assets/whatssub/whatssub.svg');

/**
 * README Preset 문자열을 기반으로 주입이 필요한 정보를 불러와 이를 주입하고, 저장합니다.
 */
function main() {
  /* README.md 프리셋 로드 */
  const readmePreset = getReadMePreset();

  /* 각 패키지별 버전 로드 */
  const logoSymbol = getLogoSymbol();

  /* 코드 주입 */
  const readme = inject(readmePreset, {
    KEY_WHATSSUB: logoSymbol,
  })
    .split(`../${RESOURCES_DIR_NAME}`)
    .join(`./${RESOURCES_DIR_NAME}`);

  /* README 내 버전 삽입 및 저장 */
  fs.writeFileSync(README_FILE, prettier.format(readme, { parser: 'markdown' }));
}

/**
 * README Preset 마크다운 코드를 불러와 문자열로 리턴합니다.
 * 
 * @returns README.md 프리셋 마크다운 문자열
 */
function getReadMePreset(): string {
  return fs.readFileSync(README_PRESET_FILE, { encoding: 'utf-8' });
}

/**
 * 왓섭 심볼을 Base64 포멧으로 로드합니다.
 * 
 * @returns 왓섭 심볼 Base64 포멧 문자열
 */
function getLogoSymbol() {
  return fs.readFileSync(WHATSSUB_FILE, { encoding: 'base64' });
}

/**
 * 주어진 코드에 데이터셋의 키 값에 따라 데이터를 교체합니다.
 * 
 * @param code 주입할 코드
 * @param dataset 주입할 데이터 객체
 * @returns 주입된 코드
 */
export function inject(code: string, dataset: Record<string, string>) {
  let result = code;

  Object.keys(dataset).forEach((key) => {
    result = result.split(`{{${key}}}`).join(dataset[key]);
  });

  return result;
}

main();
