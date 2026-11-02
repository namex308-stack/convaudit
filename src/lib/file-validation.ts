export const FILE_SIZE_GUIDANCE =
  "No fixed size limit. Very large files may be constrained by your device's available memory.";

function matchesAcceptedType(file: File, accept: string): boolean {
  const acceptedTypes = accept
    .split(",")
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean);

  return acceptedTypes.some((type) => {
    if (type.startsWith(".")) {
      return file.name.toLowerCase().endsWith(type);
    }
    if (type.endsWith("/*")) {
      return file.type.toLowerCase().startsWith(type.slice(0, -1));
    }
    return file.type.toLowerCase() === type;
  });
}

export function validateToolFile(file: File, accept: string): string | null {
  if (!matchesAcceptedType(file, accept)) {
    return `${file.name} is not a supported file type. Choose a supported file.`;
  }
  return null;
}

export function throwIfCancelled(signal: AbortSignal): void {
  if (signal.aborted) {
    throw new DOMException("Operation cancelled.", "AbortError");
  }
}
