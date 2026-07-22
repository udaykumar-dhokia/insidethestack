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
  Label,
  Skeleton,
} from "@heroui/react";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/slices/authSlice";
import { useGetMeQuery } from "@/lib/store/api/authApi";
import { PlusIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name.substring(0, 2).toUpperCase();
  };

  const UserMenu = () => {
    if (isLoadingUser) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    return (
      <Dropdown>
        {/* Use Dropdown.Trigger directly — it renders as a button. Do NOT nest another button inside. */}
        <Dropdown.Trigger className="rounded-full outline-none cursor-pointer">
          <Avatar size="sm" color="accent" className="transition-transform">
            <Avatar.Fallback>{getInitials(user?.username)}</Avatar.Fallback>
          </Avatar>
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom end" className="min-w-[200px]">
          <Dropdown.Menu
            onAction={(key) => {
              if (key === "logout") dispatch(logout());
            }}
          >
            {/* <Dropdown.Item id="account" href="/account" textValue="Account">
              <Label className="flex items-center gap-2">
                <UserIcon /> Account
              </Label>
            </Dropdown.Item> */}
            <Dropdown.Item id="logout" textValue="Log Out" variant="danger">
              <Label className="flex items-center gap-2">
                <SignOutIcon />
                Log Out
              </Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    );
  };

  // Render the auth-dependent part only after mount to avoid hydration mismatch
  const AuthSection = () => {
    if (!mounted) {
      // Show a stable placeholder on both server and first client render
      return (
        <NextLink href="/login">
          <Button size="sm" variant="primary">
            Login
          </Button>
        </NextLink>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-3 ml-2">
          <UserMenu />
        </div>
      );
    }

    return (
      <NextLink href="/login">
        <Button size="sm" variant="primary">
          Login
        </Button>
      </NextLink>
    );
  };

  const MobileAuthSection = () => {
    if (!mounted) return null;

    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      );
    }

    return (
      <NextLink href="/login">
        <Button size="sm" variant="primary">
          Login
        </Button>
      </NextLink>
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <NextLink className="flex items-center gap-1" href="/">
            <p className="font-bold text-inherit">InsideTheStack</p>
          </NextLink>
          <ul className="hidden lg:flex gap-4 ml-2">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <NextLink
                  className={clsx(
                    "text-foreground hover:text-accent transition-colors",
                    "data-[active=true]:text-accent data-[active=true]:font-medium",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <ThemeSwitch />
          <AuthSection />
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <MobileAuthSection />
          <ThemeSwitch />
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-separator sm:hidden">
          <ul className="flex flex-col gap-2 px-4 pb-4">
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Link
                  className={clsx(
                    "block py-2 text-lg no-underline",
                    index === 2 ? "text-accent" : "text-foreground",
                  )}
                  href="#"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
