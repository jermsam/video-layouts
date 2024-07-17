import {$, component$,  useOnDocument,  useSignal, useTask$} from '@builder.io/qwik';
import {DocumentHead, Link} from '@builder.io/qwik-city';
import {
  AntDesignAimOutlined, AntDesignGithubOutlined,
  Fa6SolidPlus,
  MaterialSymbolsDelete,
  MaterialSymbolsDesktopWindowsRounded,
  MaterialSymbolsFullscreen,
} from '~/components/icons';
import {largestRect} from 'rect-scaler';

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

const margin = 10;

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


  const recalculateLayout = $((adjustCount = 0) => {
    if (!tileContainer.value || !container.value) return;
    const containerComputedStyle = getComputedStyle(container.value);
    const containerPaddingX =
      parseInt(containerComputedStyle.paddingLeft.replace('px', ''), 10) +
      parseInt(containerComputedStyle.paddingRight.replace('px', ''), 10);
    const containerPaddingY =
      parseInt(containerComputedStyle.paddingTop.replace('px', ''), 10) +
      parseInt(containerComputedStyle.paddingBottom.replace('px', ''), 10);


    const containerWidth = container.value.offsetWidth - containerPaddingX -margin * 2;
    const containerHeight = container.value.offsetHeight - containerPaddingY -margin * 2;

    const tileCount = (tileContainer.value.children.length) + adjustCount;

    const rowGap = containerComputedStyle.rowGap;
    let columnGap = containerComputedStyle.columnGap;

    console.log({containerHeight, containerWidth, containerPaddingX, containerPaddingY});
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
    width.value = dimensions.width - margin * 2;
    if (columnGap !== 'normal') {
      width.value = width.value - parseInt(columnGap.replace('px', ''), 10);
    }
    height.value = dimensions.height - margin * 2;

    if (rowGap !== 'normal') {
      height.value = height.value - parseInt(rowGap.replace('px', ''), 10);
    }

  });

  const resize = $(async () => {
    if (!tileContainer.value || !container.value) return;
    const children = Array.from(tileContainer.value.children) as HTMLElement[]
    await recalculateLayout()
    tileContainer.value.innerHTML = '';
    for (const child of children) {
      child.style.width = `${width.value}px`;
      child.style.height = `${height.value}px`;
      child.style.margin = `${margin}px`;
      child.className = 'video-box';
      tileContainer.value.appendChild(child)
    }
    container.value.innerHTML = ''
    container.value.appendChild(tileContainer.value)
  })

  const addParticipantCamera = $(async () => {
    if (!tileContainer.value) return;
    const card = document.createElement('div');

    tileContainer.value.appendChild(card);
    await resize()
  });

  const removeLastCamera = $(async () => {
    if (!tileContainer.value) return;
    const children = Array.from(tileContainer.value.children);
    const deletedChild = children.pop();
    deletedChild?.remove();
    await resize()
  });

  useTask$(async ({track}) => {
    track(() => aspectRatio.value);
    await resize()
  });

  useOnDocument('DOMContentLoaded', addParticipantCamera);

  useOnDocument('resize', resize);

  return (
    <div class={'relative bg-gray-50 h-full no-scrollbar'}>
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
          <Link href="https://github.com/jermsam/video-layouts" class="link">
            Github
            <AntDesignGithubOutlined/>
          </Link>
        </section>
        <section
          id={'p'}
          style={{
            height: 'calc(100% - (72px + 1rem))',
          }}
          ref={container}
          class={'flex flex-1 rounded-md  bg-gray-50 max-h-full max-w-full p-5'}
        >
          <div
            style={{ maxWidth: `${width.value * cols.value}`}}
            class={'overflow-scroll flex flex-wrap items-center  justify-center align-middle flex-1 rounded-md no-scrollbar'}
            ref={tileContainer}
          />
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
