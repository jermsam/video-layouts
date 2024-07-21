import {$, component$, useContext, useOnDocument, useTask$} from '@builder.io/qwik';
import {DarkModeContext} from '~/routes/layout';
import {MaterialSymbolsModeNight, MaterialSymbolsSunny} from '~/components/icons';
import {isServer} from '@builder.io/qwik/build';

export default component$(() => {
  const darkMode = useContext(DarkModeContext);

  useOnDocument('DOMContentLoaded',$(()=>{
    const darkString = localStorage.getItem('dark-mode') as string;
    const dark = JSON.parse(darkString);
    darkMode.value = !!dark;
  }))

  useTask$(({ track }) => {
    track(() => darkMode.value);
    if (isServer) return;
    // https://stackoverflow.com/questions/70845195/define-dark-mode-for-both-a-class-and-a-media-query-without-repeat-css-custom-p
    const bodyClass = document.body.classList;
    darkMode.value ? bodyClass.add('dark') : bodyClass.remove('dark');
    const darkString = JSON.stringify(darkMode.value);
    localStorage.setItem('dark-mode', darkString);
  });

  return (
    <buttom class={`mode-switch z-1 text-[#fbb046] bg-gray-50 dark:bg-[#3c3f56] dark:text-gray-50`} onclick$={()=>darkMode.value = !darkMode.value}>
      {
        darkMode.value ?
          <MaterialSymbolsModeNight/> :
          <MaterialSymbolsSunny/>
      }
    </buttom>
  );
});


