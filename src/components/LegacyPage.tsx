import { useEffect, useMemo } from "react";

type LegacyPageProps = {
  pageId: string;
  bodyClassName?: string;
  html: string;
  css?: string;
  externalScripts?: string[];
  inlineScripts?: string[];
};

export default function LegacyPage({
  pageId,
  bodyClassName,
  html,
  css,
  externalScripts = [],
  inlineScripts = [],
}: LegacyPageProps) {
  const styleId = useMemo(() => `legacy-style-${pageId}`, [pageId]);

  useEffect(() => {
    let cancelled = false;
    const cleanupNodes: HTMLElement[] = [];

    if (css) {
      let style = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
        cleanupNodes.push(style);
      }
    }

    const loadExternalScripts = async () => {
      for (const src of externalScripts) {
        const selector = `script[data-legacy-src="${src}"]`;
        const existing = document.querySelector(selector) as HTMLScriptElement | null;

        if (existing?.dataset.legacyLoaded === "true") continue;

        if (existing) {
          await new Promise<void>((resolve) => {
            const onLoad = () => {
              existing.dataset.legacyLoaded = "true";
              resolve();
            };
            existing.addEventListener("load", onLoad, { once: true });
          });
          continue;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.dataset.legacySrc = src;
        document.head.appendChild(script);
        cleanupNodes.push(script);

        await new Promise<void>((resolve) => {
          script.addEventListener(
            "load",
            () => {
              script.dataset.legacyLoaded = "true";
              resolve();
            },
            { once: true }
          );
          script.addEventListener("error", () => resolve(), { once: true });
        });
      }
    };

    const runInlineScripts = () => {
      for (const code of inlineScripts) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.text = code;
        document.body.appendChild(script);
        cleanupNodes.push(script);
      }
    };

    void loadExternalScripts().then(() => {
      if (!cancelled) runInlineScripts();
    });

    return () => {
      cancelled = true;
      for (const node of cleanupNodes) {
        if (node.parentNode) node.parentNode.removeChild(node);
      }
    };
  }, [css, externalScripts, inlineScripts, styleId]);

  return (
    <div className={bodyClassName || ""}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
