/*
  Copyright 2023 Taeyoon Lee
  All rights reserved.
*/

import fs from 'fs';
import imageToBase64 from 'image-to-base64';
import path from 'path';

/* 경로 설정 */
const PREVIEW_DIR = path.resolve(__dirname, '../resources/assets/preview');
const PREVIEW_LIGHT_FILE = path.resolve(PREVIEW_DIR, 'preview.light.png');
const PREVIEW_DARK_FILE = path.resolve(PREVIEW_DIR, 'preview.dark.png');
const PREVIEW_PRESET_FILE = path.resolve(PREVIEW_DIR, 'preview.preset.svg');
const PREVIEW_FILE = path.resolve(PREVIEW_DIR, 'preview.svg');

/**
 * 프리뷰 이미지를 Base64로 인코딩하여,
 * 다크모드 대응이 가능한 프리뷰 SVG 이미지를 생성합니다.
 */
async function main(): Promise<void> {
  const previewPreset = fs.readFileSync(PREVIEW_PRESET_FILE, { encoding: 'utf-8' });
  const previewLightBase64 = await imageToBase64(PREVIEW_LIGHT_FILE);
  const previewDarkBase64 = await imageToBase64(PREVIEW_DARK_FILE);

  const code = previewPreset
    .replace(/{{PREVIEW_LIGHT}}/g, previewLightBase64)
    .replace(/{{PREVIEW_DARK}}/g, previewDarkBase64);

  fs.writeFileSync(PREVIEW_FILE, code);
}

main();
