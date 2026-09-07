import Link from "next/link";
import { CategorySlider } from "@/components/store/category-slider";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { ProductGrid } from "@/components/store/product-grid";
import { PromoSlider, type PromoSlide } from "@/components/store/promo-slider";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { toSessionUserView } from "@/lib/appwrite/session-user";
import {
  getSessionUser,
  listCategories,
  listCoverImagesByProductIds,
  listFeaturedProducts,
  listTrendingProducts,
} from "@/lib/services";
import { listOwnWishlistItems } from "@/lib/services/wishlist";

export default async function Home() {
  const authUser = await getSessionUser();
  const user = authUser ? toSessionUserView(authUser) : null;
  const isLoggedIn = Boolean(user);

  const [categories, featured, trending, wishlistItems] = await Promise.all([
    listCategories(),
    listFeaturedProducts({ limit: 8 }),
    listTrendingProducts({ limit: 8 }),
    isLoggedIn ? listOwnWishlistItems({ limit: 50 }) : Promise.resolve([]),
  ]);

  const savedProductIds = new Set(wishlistItems.map((item) => item.productId));
  const coverIds = [...featured, ...trending].map((product) => product.$id);
  const covers = await listCoverImagesByProductIds(coverIds);

  const promoProducts = featured.slice(0, 5);
  const promoSlides: PromoSlide[] = [
    ...promoProducts.map((product) => ({
      kind: "product" as const,
      product,
      cover: covers[product.$id],
    })),
    {
      kind: "cta",
      title: "Become a seller",
      description:
        "List digital goods, templates, and tools. One approval gate, then your shop goes live.",
      href: "/register/shop",
      cta: "Start selling",
    },
  ];

  return (
    <main className="relative">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PromoSlider slides={promoSlides} />
      </section>

      {categories.length > 0 ? (
        <Reveal>
          <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight">Shop by category</h2>
              <Button variant="ghost" asChild>
                <Link href="/categories">All categories</Link>
              </Button>
            </div>
            <CategorySlider categories={categories} />
          </section>
        </Reveal>
      ) : null}

      {featured.length > 0 ? (
        <Reveal>
          <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-sm text-accent">featured</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Hand-picked</h2>
              </div>
              <Button asChild>
                <Link href="/market">Browse market</Link>
              </Button>
            </div>
            <ProductGrid
              products={featured}
              covers={covers}
              isLoggedIn={isLoggedIn}
              savedProductIds={savedProductIds}
            />
          </section>
        </Reveal>
      ) : null}

      {trending.length > 0 ? (
        <Reveal>
          <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="font-mono text-sm text-accent">trending</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Moving now</h2>
            </div>
            <ProductGrid
              products={trending}
              covers={covers}
              isLoggedIn={isLoggedIn}
              savedProductIds={savedProductIds}
            />
          </section>
        </Reveal>
      ) : null}

      <Reveal>
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="font-mono text-sm text-accent">how it works</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              Three steps. No noise.
            </h2>
          </div>
          <LandingHowItWorks />
        </section>
      </Reveal>
    </main>
  );
}
