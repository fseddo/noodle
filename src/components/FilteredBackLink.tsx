"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const subscribeNoop = () => () => {};

/**
 * A back-link to a listing page that restores the filters the user left it with. The listing caches its
 * filter query string in `sessionStorage`; on the client the link points at `base?<cached>`. The server
 * snapshot is the bare `base`, so hydration matches and the cached query swaps in afterwards.
 */
export const FilteredBackLink = ({
  base,
  cacheKey,
  className,
  children,
}: {
  base: string;
  cacheKey: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const cached = useSyncExternalStore(
    subscribeNoop,
    () => window.sessionStorage.getItem(cacheKey),
    () => null,
  );
  const href = cached ? `${base}?${cached}` : base;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
