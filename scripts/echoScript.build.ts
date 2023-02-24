/*
  Copyright 2023 Taeyoon Lee
  All rights reserved.
*/

import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

import { ConsoleStyle, styleConsole } from './echoScript.util';

import type { PackageJson } from 'wonderful-tools';

/**
 * ### package.json 에코 스크립트
 * 
 * 에코 스크립트가 포함된 package.json 타입
 */
export interface PackageJsonEcho extends PackageJson {
  /**
   * ### 에코 스크립트
   * 
   * 실행, 종료 안내가 필요한 스크립트 목록
   */
  echoScripts?: Record<string, string>;
}

/* 상수 지정 */
export const PACKAGE_JSON_FILE = path.resolve(__dirname, '../package.json');
const PROJECT_NAME = 'T.';

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

    // echoScript 기반 스크립트 추가
    const arrow = styleConsole('➔', ConsoleStyle.Black);
    const libraryName = styleConsole(`[${PROJECT_NAME}]`, [ConsoleStyle.Bold, ConsoleStyle.Blue]);
    const dash = styleConsole('-', ConsoleStyle.Black);
    const spacer = (script: string) => {
      const space = '--------------------';
      return styleConsole(space.slice(script.length), ConsoleStyle.Black);
    };

    const getStartComment = (script: string) => {
      const packageName = (() => {
        const split = (packageJson.name ?? 'no-package-name').split('/');

        if (split.length >= 2) {
          const [whatssub, ...name] = split;

          return (
            styleConsole(whatssub ?? 'empty-scope', ConsoleStyle.Reset) +
            styleConsole([, ...name].join('/'), ConsoleStyle.Blue)
          );
        }
        return styleConsole(packageJson.name ?? 'no-package-name', ConsoleStyle.Reset);
      })();
      const dash = styleConsole('-', ConsoleStyle.Black);
      const command = (script: string) => {
        const splitted = script.split(':');
        if (splitted.length >= 2) {
          const [main, ...sub] = splitted;

          return (
            styleConsole(main ?? 'no-script-found', [ConsoleStyle.Bold, ConsoleStyle.Italic]) +
            styleConsole([, ...sub].join(':'), [ConsoleStyle.Bold, ConsoleStyle.Italic, ConsoleStyle.Purple])
          );
        }
        return styleConsole(script, [ConsoleStyle.Bold, ConsoleStyle.Italic]);
      };

      return `echo "${arrow} ${libraryName} ${packageName} ${dash} ${command(script)} ${spacer(
        script,
      )} Starting script..."`;
    };

    const getEndComment = (script: string) => {
      const packageName = styleConsole(packageJson.name ?? 'no-package-name', ConsoleStyle.Black);
      const command = styleConsole(script, [ConsoleStyle.Bold, ConsoleStyle.Italic, ConsoleStyle.Black]);
      const done = styleConsole('Done ✅', [ConsoleStyle.Bold, ConsoleStyle.Green]);

      return `echo "${arrow} ${libraryName} ${packageName} ${dash} ${command} ${spacer(script)} ${done}"`;
    };

    packageJson.scripts = {
      ...packageJson.scripts,
      ...Object.fromEntries(
        Object.entries(packageJson.echoScripts).map(([key, script]) => [
          key,
          `${getStartComment(key)} && ${script} && ${getEndComment(key)}`,
        ]),
      ),
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
