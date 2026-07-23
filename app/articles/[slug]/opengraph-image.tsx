import { ImageResponse } from "next/og";
import { getArticleBySlugFromApi, getArticlesFromApi } from "@/lib/articles";

export async function generateStaticParams() {
  const articles = await getArticlesFromApi();
  if (!articles || articles.length === 0) {
    return [{ slug: 'fallback' }];
  }
  return articles.map((article) => ({
    slug: article?.slug,
  }));
}

export const dynamic = 'force-static';

export const alt = "InsideTheStack Article Cover";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlugFromApi(slug);

  if (!article) {
    return new Response("Not Found", { status: 404 });
  }

  const title = article.meta.title || "InsideTheStack";
  const category = article.meta.category || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo / Brand Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            color: "#ffffff",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{ display: "flex", color: "#3b82f6", marginRight: "8px" }}
          >
            Inside
          </div>
          <div style={{ display: "flex", color: "#ffffff" }}>TheStack</div>
        </div>

        {/* Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            flex: 1,
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Article Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              paddingRight: article.meta.image ? "60px" : "0",
            }}
          >
            {category && (
              <div
                style={{
                  color: "#3b82f6",
                  fontSize: 28,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "20px",
                }}
              >
                {category}
              </div>
            )}
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                maxWidth: article.meta.image ? "600px" : "900px",
              }}
            >
              {title}
            </div>
          </div>

          {/* Article Image */}
          {article.meta.image && (
            <div
              style={{
                display: "flex",
                width: "400px",
                height: "300px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={article.meta.image}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#a1a1aa",
              fontSize: 28,
              display: "flex",
              alignItems: "center",
            }}
          >
            udaykumar-dhokia.github.io/insidethestack
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
