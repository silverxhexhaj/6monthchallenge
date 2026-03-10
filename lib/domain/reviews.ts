export type ReviewStatus = "draft" | "submitted" | "missed" | "locked";

export interface ReviewSnapshot {
  status: ReviewStatus;
  submittedAt?: string | null;
}

export function hasSubmittedReview(review: ReviewSnapshot | null | undefined) {
  return review?.status === "submitted";
}

export function toReviewItems(rawValue: string) {
  return rawValue
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
