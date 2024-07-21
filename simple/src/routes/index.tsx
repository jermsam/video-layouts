import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import ModeSwitch from '~/components/ModeSwitch';

export default component$(() => {
  return (
    <div class={'relative bg-[#eaebf5] dark:bg-[#262a42] h-screen'}>
     <ModeSwitch/>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
