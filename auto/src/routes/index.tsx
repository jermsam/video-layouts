import {$, component$,  useOnDocument, useSignal,  useTask$} from '@builder.io/qwik';
import {DocumentHead, Link} from '@builder.io/qwik-city';
import {
  AntDesignAimOutlined, AntDesignGithubOutlined,
  Fa6SolidPlus,
  MaterialSymbolsDelete,
  MaterialSymbolsDesktopWindowsRounded,
  MaterialSymbolsFullscreen,
} from '~/components/icons';
import {largestRect, largestSquare} from 'rect-scaler';

const VIDEO_SRC =
  'https://cdn.builder.io/o/assets%2F5b8073f890b043be81574f96cfd1250b%2F8b210c56974440649a0a78d4a3a0ddc5%2Fcompressed?apiKey=5b8073f890b043be81574f96cfd1250b&token=8b210c56974440649a0a78d4a3a0ddc5&alt=media&optimized=true';


const aspectRatios = [
  {
    ratio: 16 / 9,
    label: '16:9',
    ratioClass: 'aspect-[16/9]',
  },
  {
    ratio: 4 / 3,
    label: '4:3',
    ratioClass: 'aspect-[4/3]',
  },
  {
    ratio: 1,
    label: '1:1',
    ratioClass: 'aspect-[1/1]',
  },
  {
    ratio: 1 / 2,
    label: '1:2',
    ratioClass: 'aspect-[1/2]',
  },
];

export default component$(() => {
  const container = useSignal<HTMLDivElement>();
  const tileContainer = useSignal<HTMLDivElement>();
  const aspectRatio = useSignal({
    ratio: 16 / 9,
    label: '16:9',
    ratioClass: 'aspect-[16/9]',
  });

  const cols = useSignal(1);
  const rows = useSignal(1);
  const width = useSignal(0);
  const height = useSignal(0);


  const recalculateLayout = $((adjustCount=0) => {
    if (tileContainer.value) {
      const containerComputedStyle = getComputedStyle(tileContainer.value);
      const containerPaddingX =
        parseInt(containerComputedStyle.paddingLeft.replace('px',''),10) +
        parseInt(containerComputedStyle.paddingRight.replace('px',''),10);
      const containerPaddingY =
        parseInt(containerComputedStyle.paddingTop.replace('px',''),10) +
        parseInt(containerComputedStyle.paddingBottom.replace('px',''),10);

      const containerWidth = tileContainer.value.offsetWidth - containerPaddingX  ;
      const containerHeight = tileContainer.value.offsetHeight - containerPaddingY;

      const tileCount = (tileContainer.value.children.length) + adjustCount;

      const rowGap =  containerComputedStyle.rowGap;
      let columnGap = containerComputedStyle.columnGap;

      console.log({containerHeight, containerWidth, containerPaddingX,containerPaddingY});
      //
      const aspectArray = aspectRatio.value.label.split(':');
      const aspectWidth = Number(aspectArray[0]);
      const aspectHeight = Number(aspectArray[1]);
      const dimensions = largestRect(
        containerWidth,
        containerHeight,
        tileCount,
        aspectWidth,
        aspectHeight,
      );
      //
      cols.value = dimensions.cols;
      width.value = dimensions.width;
      if(columnGap !=='normal') {
        width.value = width.value - parseInt(columnGap.replace('px',''),10)
      }
      height.value = dimensions.height;
      if(rowGap !=='normal') {
        height.value = height.value - parseInt(rowGap.replace('px',''),10)
      }
    }
  });

  const addParticipantCamera = $(async () => {
    if(!tileContainer.value) return
    await recalculateLayout(1);
    const card = document.createElement('div');
    for (const child  of [...Array.from(tileContainer.value.children), card] as HTMLElement[]){
      child.style.width=  `${width.value}px`;
      child.style.height=  `${height.value}px`;
      child.className='bg-gray-200 rounded-md overflow-hidden transition-opacity duration-500  flex items-center justify-center';
    }
    tileContainer.value.appendChild(card)
  });

  const removeLastCamera = $(async () => {
    if(!tileContainer.value) return
    const children = Array.from(tileContainer.value.children);
    const deletedChild = children.pop();
    deletedChild?.remove()
    await recalculateLayout();
    for (const child  of [...Array.from(tileContainer.value.children)] as HTMLElement[]){
      child.style.width=  `${width.value}px`;
      child.style.height=  `${height.value}px`;
      child.className=`bg-gray-200 rounded-md overflow-hidden transition-opacity duration-500  flex items-center justify-center`;
    }
  })

  useTask$(async ({track}) => {
    track(() => aspectRatio.value)
    if(!tileContainer.value) return
    await recalculateLayout();
    for (const child  of [...Array.from(tileContainer.value.children)] as HTMLElement[]){
      child.style.width=  `${width.value}px`;
      child.style.height=  `${height.value}px`;
      child.className='bg-gray-200 rounded-md overflow-hidden transition-opacity duration-500  flex items-center justify-center';
    }
  })

  useOnDocument('DOMContentLoaded', $(async () => {
    await addParticipantCamera()
  }));
  useOnDocument('resize', $(async () => {
    await recalculateLayout(1)
  }));



  return (
    <div class={'relative bg-gray-50 h-full'}>
      <section class={'absolute inset-0 bg-gray-100 flex flex-col'}>
        <section class={'controls'}>
          <button class={'button bg-blue-500 text-white'} onClick$={addParticipantCamera}>
            <Fa6SolidPlus/>
          </button>
          <button class={'button bg-red-500 text-white'} onClick$={removeLastCamera}>
            <MaterialSymbolsDelete/>
          </button>
          <button class={'button'}>
            <MaterialSymbolsDesktopWindowsRounded/>
          </button>
          <button class={'button'}>
            <MaterialSymbolsFullscreen/>
          </button>
          <button class={'button '}>
            <AntDesignAimOutlined/>
          </button>
          {
            aspectRatios.map((ratio, index) =>
              <button key={index} class={'button'} onClick$={() => aspectRatio.value = ratio}>
                {ratio.label}
              </button>,
            )
          }
          {rows.value}: {cols.value}
          <Link href="https://github.com/Alicunde/Videoconference-Dish-CSS-JS" class="link">
            Github
            <AntDesignGithubOutlined/>
          </Link>
        </section>
        <section
          id={'p'}
          style={{
          height: 'calc(100% - (72px + 1rem))'
        }}
          ref={container}
          class={'flex flex-col bg-gray-50 items-center justify-center p-5'}
        >
          <div class={'flex flex-wrap align-center items-center justify-center gap-2 m-5 h-full w-full'} ref={tileContainer}/>
        </section>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
