import { cacheLife } from "next/cache";

export default async function Footer() {
  "use cache";
  cacheLife("hours");

  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} TechNova Computers.
        All rights reserved.
      </p>
    </footer>
  );
}
