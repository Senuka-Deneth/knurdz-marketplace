import Link from "next/link";
import { CreateListingForm } from "@/components/seller/create-listing-form";
import { Button } from "@/components/ui/button";
import { listCategories } from "@/lib/services/categories";
import { areFreeListingsEnabled } from "@/lib/services/platform-settings";

export default async function NewListingPage() {
  const [categories, freeListingsEnabled] = await Promise.all([
    listCategories(),
    areFreeListingsEnabled(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mt-3 text-3xl font-bold tracking-tight">New listing</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Drafts stay private. Save draft to keep working, or List to send the
        item for admin review. It is not live on the storefront until an admin
        approves it.
      </p>

      <CreateListingForm
        categories={categories}
        freeListingsEnabled={freeListingsEnabled}
      />

      <div className="mt-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/seller/listings">Back to listings</Link>
        </Button>
      </div>
    </div>
  );
}
