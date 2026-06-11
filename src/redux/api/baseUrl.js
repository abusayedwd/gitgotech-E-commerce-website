// Base URL for server-hosted images.
// Consumers import this as a default export and build paths like `${url}/${imagePath}`.
// Single source of truth lives in src/lib/imageBaseUrl.ts (NEXT_PUBLIC_IMAGE_URL).
import { IMAGE_BASE_URL } from "@/lib/imageBaseUrl";

const url = IMAGE_BASE_URL;

export default url;
