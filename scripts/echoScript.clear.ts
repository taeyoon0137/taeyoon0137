/*
  Copyright 2022. Whatssub co.,Ltd.
  All rights reserved.
*/

import fs from 'fs';
import prettier from 'prettier';

import { PACKAGE_JSON_FILE } from './echoScript.build';

import type { PackageJsonEcho } from './echoScript.build'

/**
 * 전체 package.json을 순회하며, echoScript 내 명령어들을 echo를 포함하여 script에 생성합니다.
 * 만약 해당 명령어가 이미 script에 있다면, 이를 삭제합니다.
 */
function main() {
    let packageJson = { ...getPackageJson() };

    // echoScript 객체가 없는 경우 생략
    if (!packageJson.echoScripts) return;

    // echoScript 객체가 있는 경우
    // 기존 echoScript 기반 스크립트 삭제
    if (packageJson.scripts)
      packageJson.scripts = Object.fromEntries(
        Object.entries(packageJson.scripts).filter(
          ([key, _value]) => !packageJson.echoScripts || !Object.keys(packageJson.echoScripts).includes(key),
        ),
      );

    // echo가 없는 코드 주입
    packageJson.scripts = {
      ...packageJson.scripts,
      ...Object.fromEntries(Object.entries(packageJson.echoScripts).map(([key, script]) => [key, script])),
    };

    // 변경사항 저장
    fs.writeFileSync(PACKAGE_JSON_FILE, prettier.format(JSON.stringify(packageJson), { parser: 'json-stringify' }));
}

/**
 * 주어진 경로에서 package.json을 읽습니다.
 *
 * @param dir package.json을 찾을 경로
 * @returns 찾은 package.json 객체
 */
function getPackageJson(): PackageJsonEcho {
  return JSON.parse(fs.readFileSync(PACKAGE_JSON_FILE, { encoding: 'utf-8' }));
}

main();
