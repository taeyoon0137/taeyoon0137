/*
  Copyright 2023 Taeyoon Lee
  All rights reserved.
*/

import fs from 'fs';
import path from 'path';

import prettier from 'prettier';

/* 파일명 및 경로 설정 */
const README_FILE = path.resolve(__dirname, '../README.md');
const RESOURCES_DIR_NAME = path.resolve('resources');
const RESOURCES_DIR = path.resolve(__dirname, RESOURCES_DIR_NAME);
const README_PRESET_FILE = path.resolve(RESOURCES_DIR, './README.preset.md');
const LOGOS_DIR = path.resolve(RESOURCES_DIR, './assets/logos');
const VENDIT_FILE = path.resolve(LOGOS_DIR, './vendit.svg');
const WHATSSUB_FILE = path.resolve(LOGOS_DIR, './whatssub.svg');

/**
 * README Preset 문자열을 기반으로 주입이 필요한 정보를 불러와 이를 주입하고, 저장합니다.
 */
async function main() {
  /* README.md 프리셋 로드 */
  const readmePreset = getReadMePreset();

  /* 로고 심볼 로드 */
  const venditSymbol = getLogoSymbol(VENDIT_FILE);
  const whatssubSymbol = getLogoSymbol(WHATSSUB_FILE);

  /* 코드 주입 */
  const readme = inject(readmePreset, {
    KEY_VENDIT: venditSymbol,
    KEY_WHATSSUB: whatssubSymbol,
  })
    .split(`../${RESOURCES_DIR_NAME}`)
    .join(`./${RESOURCES_DIR_NAME}`);

  /* README 내 버전 삽입 및 저장 */
  fs.writeFileSync(README_FILE, await prettier.format(readme, { parser: 'markdown' }));
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
 * 심볼 SVG를 URL-safe Base64 포멧으로 로드합니다.
 * 
 * @param file 로드할 심볼 SVG 파일 경로
 * @returns 심볼 SVG URL-safe Base64 포멧 문자열
 */
function getLogoSymbol(file: string) {
  return encodeURIComponent(fs.readFileSync(file, { encoding: 'base64' }));
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
