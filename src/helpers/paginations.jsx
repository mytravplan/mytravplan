
import { PER_PAGE_LIMIT } from "@/utils/apis/api";

export function getPaginationParams(req) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || PER_PAGE_LIMIT;
    const skip = limit * (page - 1);
    return { page, limit, skip };
}
