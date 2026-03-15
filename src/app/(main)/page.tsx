import { DDayBar } from "@/components/feed/DDayBar";
import { MainFeed } from "@/components/feed/MainFeed";
import { FAB } from "@/components/feed/FAB";

export default function HomePage() {
  return (
    <main>
      <DDayBar />
      <MainFeed />
      <FAB />
    </main>
  );
}
