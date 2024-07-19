import {$, component$, useOnDocument, useOnWindow, useSignal} from '@builder.io/qwik';
import {DocumentHead, Link} from '@builder.io/qwik-city';
import {
  AntDesignGithubOutlined,
  Fa6SolidPlus,
  MaterialSymbolsDelete,
  MaterialSymbolsDesktopWindowsRounded,
  MaterialSymbolsFullscreen,
} from '~/components/icons';
import {largestRect} from 'rect-scaler';

export interface AspectRatio {
  ratio: number,
  label: string,
  ratioClass: string,
}

const VIDEO_SRC = 'https://sg.fiverrcdn.com/packages_lp/cover_video.mp4';

const aspectRatios: AspectRatio[] = [
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
  const isVideo = useSignal<boolean>(true);
  const sidebar = useSignal<boolean>(false);
  const container = useSignal<HTMLDivElement>();
  const tileContainer = useSignal<HTMLDivElement>();
  const aspectRatio = useSignal<AspectRatio>();

  const width = useSignal(0);
  const height = useSignal(0);

  const getUsableDimensions = $(() => {
    if (!tileContainer.value) return {usableWidth: 0, usableHeight: 0};
    const containerComputedStyle = getComputedStyle(tileContainer.value);
    const containerPaddingX =
      parseInt(containerComputedStyle.paddingLeft.replace('px', ''), 10) +
      parseInt(containerComputedStyle.paddingRight.replace('px', ''), 10);
    const containerPaddingY =
      parseInt(containerComputedStyle.paddingTop.replace('px', ''), 10) +
      parseInt(containerComputedStyle.paddingBottom.replace('px', ''), 10);

    const containerWidth = tileContainer.value.offsetWidth - containerPaddingX;
    const containerHeight = tileContainer.value.offsetHeight - containerPaddingY;

    return {containerWidth, containerHeight};
  });

  const resizer = $((width: number, height: number, margin: number) => {
    if (!tileContainer.value) return;
    const children = Array.from(tileContainer.value.children) as HTMLElement[];
    for (const child of children) {
      child.style.width = `${width}px`;
      child.style.height = `${height}px`;
      child.style.margin = `${margin / 2}px`; // Ensure margins are applied uniformly
      child.className = 'video-box';
    }
  });

  const resize = $(async () => {
    if (!tileContainer.value) return;
    if(!aspectRatio.value) {
      aspectRatio.value = aspectRatios[0];
    }
    const tileCount = tileContainer.value.children.length;
    if(!tileCount) return;
    const containerDimensions = await getUsableDimensions();

    const aspectArray = aspectRatio.value.label.split(':');
    const aspectWidth = Number(aspectArray[0]);
    const aspectHeight = Number(aspectArray[1]);
    const containerWidth = containerDimensions.containerWidth as number;
    const containerHeight = containerDimensions.containerHeight as number;

    const dimensions = largestRect(
      containerWidth,
      containerHeight,
      tileCount,
      aspectWidth,
      aspectHeight,
    );

    width.value = dimensions.width - margin;
    height.value = dimensions.height - margin;
    await resizer(width.value, height.value, margin);
  });


  const addParticipantCamera = $(async () => {
    if (!tileContainer.value) return;
    const card = document.createElement('div');
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true
    video.className =  `video ${isVideo.value ? 'opacity-1': 'opacity-0'}`
    video.src= VIDEO_SRC
    video.loop = true
    card.appendChild(video)
    tileContainer.value.appendChild(card);
    await resize();
  });

  const removeLastCamera = $(async () => {
    if (!tileContainer.value) return;
    const children = Array.from(tileContainer.value.children);
    const deletedChild = children.pop();
    deletedChild?.remove();
    await resize();
  });

  const showVideo = $(()=>{
    if (!tileContainer.value) return;
    const children = Array.from(tileContainer.value.children) as HTMLElement[];
    isVideo.value = !isVideo.value
    for (const child of children) {
     const  videoElement = child.querySelector('video') as HTMLVideoElement;
      if(isVideo.value) {
        videoElement.classList.remove('opacity-0');
        videoElement.classList.add('opacity-1');
      } else {
        videoElement.classList.remove('opacity-1');
        videoElement.classList.add('opacity-0');
      }
    }
  })

  const showSideBar = $(async ()=>{
    if (!tileContainer.value || !container.value) return;
    const children = Array.from(tileContainer.value.children) as HTMLElement[];
    sidebar.value = !sidebar.value;
    const containerComputedStyle = getComputedStyle(tileContainer.value);
    const containerPaddingY =
      parseInt(containerComputedStyle.paddingTop.replace('px', ''), 10) +
      parseInt(containerComputedStyle.paddingBottom.replace('px', ''), 10);
    const screenHeight = tileContainer.value.offsetHeight -containerPaddingY;
    if(sidebar.value && children.length > 1){
      tileContainer.value.classList.add('bg-yellow-300')
      const screen = children.pop() as HTMLElement;
      screen.style.width = '60%'
      screen.style.height = `${screenHeight}px`
      screen.id = 'screen'
      // const child = children.pop() as HTMLElement
      // screen.appendChild(child)
      container.value.innerHTML=''
      tileContainer.value.innerHTML= '';
      container.value?.appendChild(screen)
      tileContainer.value.style.maxHeight = `${screenHeight}px`
      container.value.appendChild(tileContainer.value)
      for (const child of children) {
        tileContainer.value.appendChild(child)
      }
      await resize()
    } else {
      const screen = document.getElementById('screen') as HTMLElement;
      screen.id = '';
      tileContainer.value.classList.remove('bg-yellow-300')
      container.value.removeChild(screen);
      tileContainer.value.appendChild(screen)
      await resize()
    }
  })

const changeAspectRatio = $(async (ratio: AspectRatio) => {
  aspectRatio.value = ratio
  await resize();
})




  useOnDocument('DOMContentLoaded', addParticipantCamera);
  useOnWindow('resize', resize);

  return (
    <div class={'relative bg-yellow-50 h-full no-scrollbar'}>
      <section class={'absolute inset-0 bg-yellow-300 flex flex-col'}>
        <section class={'controls'}>
          <button class={'button bg-orange-500 text-white'} onClick$={addParticipantCamera}>
            <Fa6SolidPlus/>
          </button>
          <button class={'button bg-red-500 text-white'} onClick$={removeLastCamera}>
            <MaterialSymbolsDelete/>
          </button>
          <button class={`button ${isVideo.value ? 'is-active' : ''}`} onClick$={showVideo}>
            <MaterialSymbolsDesktopWindowsRounded/>
          </button>
          <button class={`button  ${sidebar.value ? 'is-active' : ''}`} onClick$={showSideBar}>
            <MaterialSymbolsFullscreen/>
          </button>

          {aspectRatios.map((ratio, index) => (
            <button key={index}
                    class={`button ${aspectRatio.value?.ratioClass === ratio.ratioClass ? 'is-active' : ''}`}
                    onClick$={()=>changeAspectRatio(ratio)}>
              {ratio.label}
            </button>
          ))}
          <Link href="https://github.com/jermsam/video-layouts" class="link">
            Github
            <AntDesignGithubOutlined/>
          </Link>
        </section>
        <section
          ref={container}
          class={'flex flex-1 justify-around rounded-md bg-yellow-400 max-h-full max-w-full p-5'}
        >
          <div
            class={'overflow-scroll justify-center flex flex-wrap content-center flex-1 rounded-md no-scrollbar'}
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
