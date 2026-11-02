import assert from "node:assert/strict";
import test from "node:test";
import {
  FILE_SIZE_GUIDANCE,
  validateToolFile,
} from "../src/lib/file-validation.ts";

const makeFile = (name, type, size) => ({ name, type, size });

test("accepts files of any size and displays memory guidance", () => {
  const veryLargeFile = makeFile("photo.png", "image/png", 10 ** 12);
  assert.equal(validateToolFile(veryLargeFile, "image/*"), null);
  assert.match(FILE_SIZE_GUIDANCE, /No fixed size limit/);
  assert.match(FILE_SIZE_GUIDANCE, /device's available memory/);
});

test("matches extensions when a browser reports no MIME type", () => {
  const file = makeFile("photo.heic", "", 1024);
  assert.equal(validateToolFile(file, "image/*,.heic"), null);
});

test("rejects files outside the tool's accepted types", () => {
  const file = makeFile("document.pdf", "application/pdf", 1024);
  assert.match(validateToolFile(file, "image/*,.heic"), /not a supported file type/);
});
