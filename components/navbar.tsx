"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Kbd,
  Link,
  TextField,
  InputGroup,
  Avatar,
  Dropdown,
  Skeleton,
} from "@heroui/react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/slices/authSlice";
import { useGetMeQuery } from "@/lib/store/api/authApi";
import { SignOutIcon } from "@phosphor-icons/react";

const getInitials = (name?: string) => {
  if (!name) return "";
  return name.substring(0, 2).toUpperCase();
};

// Defined OUTSIDE Navbar to preserve stable identity across renders
function UserMenu({
  user,
  isLoadingUser,
  onLogout,
}: {
  user?: { username?: string };
  isLoadingUser: boolean;
  onLogout: () => void;
}) {
  if (isLoadingUser) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button isIconOnly variant="light" size="sm" className="rounded-full p-0 min-w-0 w-8 h-8">
          <Avatar size="sm" color="accent" className="transition-transform">
            <Avatar.Fallback>{getInitials(user?.username)}</Avatar.Fallback>
          </Avatar>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => {
            if (key === "logout") onLogout();
          }}
        >
          <Dropdown.Item id="logout" textValue="Log Out" variant="danger">
            <div className="flex items-center gap-2">
              <SignOutIcon /> Log Out
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoadingUser = isAuthenticated && !user;

  useGetMeQuery(undefined, {
    skip: !isLoadingUser,
  });

  const searchInput = (
    <TextField aria-label="Search" type="search">
      <InputGroup>
        <InputGroup.Prefix>
          <SearchIcon className="text-base text-muted pointer-events-none flex-shrink-0" />
        </InputGroup.Prefix>
        <InputGroup.Input className="text-sm" placeholder="Search..." />
        <InputGroup.Suffix>
          <Kbd className="hidden lg:inline-flex">
            <Kbd.Abbr keyValue="command" />
            <Kbd.Content>K</Kbd.Content>
          </Kbd>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  );

  const renderAuthSection = () => {
    if (!mounted) {
      return (
        <Button onPress={() => router.push("/login")} size="sm" color="primary">
          Login
        </Button>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-3 ml-2">
          <UserMenu
            user={user ?? undefined}
            isLoadingUser={isLoadingUser}
            onLogout={() => dispatch(logout())}
          />
        </div>
      );
    }

    return (
      <Button onPress={() => router.push("/login")} size="sm" color="primary">
        Login
      </Button>
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <NextLink className="flex items-center gap-1" href="/">
            <p className="font-bold text-inherit text-xl tracking-tight">co<span className="text-primary">Decode</span></p>
          </NextLink>
          <ul className="hidden lg:flex gap-4 ml-2">
            {siteConfig.navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <NextLink
                    className={clsx(
                      "transition-colors",
                      isActive
                        ? "bg-clip-text text-transparent bg-gradient-to-b from-[#5EA2EF] to-[#0072F5] font-bold"
                        : "text-foreground hover:text-primary",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <ThemeSwitch />
          {renderAuthSection()}
        </div>

        <div className="flex sm:hidden items-center gap-2">
          {mounted && isAuthenticated ? (
            <UserMenu
              user={user ?? undefined}
              isLoadingUser={isLoadingUser}
              onLogout={() => dispatch(logout())}
            />
          ) : (
            <Button onPress={() => router.push("/login")} size="sm" color="primary">
              Login
            </Button>
          )}
          <ThemeSwitch />
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-separator sm:hidden">
          <ul className="flex flex-col gap-2 px-4 pb-4">
            {siteConfig.navMenuItems.map((item, index) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={`${item.label}-${index}`}>
                  <Link
                    className={clsx(
                      "block py-2 text-lg no-underline",
                      isActive
                        ? "bg-clip-text text-transparent bg-gradient-to-b from-[#5EA2EF] to-[#0072F5] font-bold"
                        : "text-foreground",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};
