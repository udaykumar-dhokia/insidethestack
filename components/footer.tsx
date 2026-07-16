import React from "react";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";
import { GithubIcon, TwitterIcon } from "@/components/icons";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-separator py-10 mt-auto bg-background/50">
      <div className="mx-auto max-w-[1280px] px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="font-bold text-inherit text-lg">InsideTheStack</p>
          <p className="text-sm text-muted max-w-xs text-center md:text-left">
            {siteConfig.description}
          </p>
          <p className="text-xs text-muted mt-2">
            &copy; {new Date().getFullYear()} InsideTheStack. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-muted">
            <NextLink href="/" className="hover:text-foreground transition-colors">
              Home
            </NextLink>
            <NextLink href="/articles" className="hover:text-foreground transition-colors">
              Articles
            </NextLink>
            <a 
              href={siteConfig.links.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <GithubIcon className="w-4 h-4" /> Github
            </a>
            <a 
              href={siteConfig.links.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <TwitterIcon className="w-4 h-4" /> Twitter
            </a>
          </div>
          
          <div className="mt-2">
            <a
              href="https://www.buymeacoffee.com/udthedeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity inline-block"
            >
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=udthedeveloper&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                alt="Buy me a coffee"
                style={{ height: "40px", width: "170px" }}
              />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
