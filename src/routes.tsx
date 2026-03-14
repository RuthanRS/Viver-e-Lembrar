import { createBrowserRouter } from "react-router";
import { Welcome } from "./components/Welcome";
import { Home } from "./components/Home";
import { PhotoAlbum } from "./components/PhotoAlbum";
import { Reminders } from "./components/Reminders";
import { Contacts } from "./components/Contacts";
import { DailyRoutine } from "./components/DailyRoutine";
import { MemoryGame } from "./components/MemoryGame";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/album",
    Component: PhotoAlbum,
  },
  {
    path: "/lembretes",
    Component: Reminders,
  },
  {
    path: "/contatos",
    Component: Contacts,
  },
  {
    path: "/rotina",
    Component: DailyRoutine,
  },
  {
    path: "/jogo",
    Component: MemoryGame,
  },
]);
