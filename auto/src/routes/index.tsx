import {
  $,
  component$,
  useOnDocument,
  useOnWindow,
  useSignal,
} from '@builder.io/qwik';
import {DocumentHead, Link} from '@builder.io/qwik-city';
import {
  AntDesignGithubOutlined,
  Fa6SolidPlus,
  MaterialSymbolsDelete,
  MaterialSymbolsDesktopWindowsRounded,
  MaterialSymbolsLightCropLandscapeOutline,
  MaterialSymbolsSpaceDashboardOutlineSharp,
} from '~/components/icons';
import {largestRect} from 'rect-scaler';

export interface AspectRatio {
  ratio: number,
  label: string,
  ratioClass: string,
}

const VIDEO_SRC = 'video.mp4';

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
  const spotlight = useSignal<boolean>(false);
  const showAdvancedLayoutOptions = useSignal<boolean>(false);
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
    showAdvancedLayoutOptions.value = (children.length > (sidebar.value ? 0 : 1));

  });

  const resize = $(async () => {
    if (!tileContainer.value) return;
    if (!aspectRatio.value) {
      aspectRatio.value = aspectRatios[0];
    }
    const tileCount = tileContainer.value.children.length;
    if (!tileCount) return;
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
    video.muted = true;
    video.className = `video ${isVideo.value ? 'opacity-1' : 'opacity-0'}`;
    video.src = VIDEO_SRC;
    video.loop = true;
    card.appendChild(video);
    tileContainer.value.appendChild(card);
    await resize();
  });

  const showVideo = $(() => {
    if (!tileContainer.value) return;
    const children = Array.from(tileContainer.value.children) as HTMLElement[];
    isVideo.value = !isVideo.value;
    for (const child of children) {
      const videoElement = child.querySelector('video') as HTMLVideoElement;
      if (isVideo.value) {
        videoElement.classList.remove('opacity-0');
        videoElement.classList.add('opacity-1');
      } else {
        videoElement.classList.remove('opacity-1');
        videoElement.classList.add('opacity-0');
      }
    }
  });


  const removeScreen = $(async () => {
    if (!tileContainer.value || !container.value) return;
    const screen = document.getElementById('screen') as HTMLElement;
    screen.id = '';
    tileContainer.value.classList.remove('bg-yellow-300');
    screen.classList.remove('relative');
    const thumbnail = screen.querySelector('div');
    if (thumbnail) {
      screen.removeChild(thumbnail)
      tileContainer.value.appendChild(thumbnail);
    }
    container.value.removeChild(screen);
    tileContainer.value.appendChild(screen);
    await resize();
  })

  const addScreen = $(async (screenToAdd: HTMLElement) => {
    const screen = document.getElementById('screen') as HTMLElement;
    if (screen || !tileContainer.value || !container.value) return;
    tileContainer.value.removeChild(screenToAdd)
    const tileContainerComputedStyle = getComputedStyle(tileContainer.value);
    const tileContainerPaddingY =
      parseInt(tileContainerComputedStyle.paddingTop.replace('px', ''), 10) +
      parseInt(tileContainerComputedStyle.paddingBottom.replace('px', ''), 10);
    const screenHeight = tileContainer.value.offsetHeight - tileContainerPaddingY;
    screenToAdd.style.height = `${screenHeight}px`;
    screenToAdd.id = 'screen';
    container.value.innerHTML = '';
    container.value?.appendChild(screenToAdd);
    tileContainer.value.style.maxHeight = `${screenHeight}px`;
    container.value.appendChild(tileContainer.value);
    await resize();
  })


  const showSideBar = $(async () => {
    if (!tileContainer.value || !container.value) return;
    const children = Array.from(tileContainer.value.children) as HTMLElement[];
    sidebar.value = !sidebar.value;
    if (sidebar.value) {
      if(spotlight.value) {
        await removeScreen();
        spotlight.value = false;
      }
      tileContainer.value.classList.add('bg-yellow-300');
      const screen = children.pop() as HTMLElement;
      screen.style.width = '70%';
      await addScreen(screen)
    } else {
      await removeScreen();
    }
  });

  const makeSpotlight = $(async () => {
    if (!tileContainer.value || !container.value) return;
    spotlight.value = !spotlight.value;

    if(spotlight.value) {
      if(sidebar.value) {
        await removeScreen();
        sidebar.value = false;
      }
      let screen = document.getElementById('screen') as HTMLElement;
      const children = Array.from(tileContainer.value.children) as HTMLElement[];
      let thumbnail;
      if(!screen) {
        screen = children.pop() as HTMLElement;
        // tileContainer.value.removeChild(screen)
      }
      thumbnail = children.pop() as HTMLElement
      tileContainer.value.removeChild(thumbnail)
      screen.style.width = '100%';
      screen.classList.add('relative')

      console.log(thumbnail)
      thumbnail.style.width='320px'
      const ratio = aspectRatio.value?.ratio as number
      thumbnail.style.height= `${320 * (1/ratio)}px`
      thumbnail.classList.add('absolute','right-2','bottom-2',)
      screen.appendChild(thumbnail)
      await addScreen(screen)
    } else {
      await removeScreen();
    }
  });

  const removeLastCamera = $(async () => {
    if (!tileContainer.value) return;
    let children = Array.from(tileContainer.value.children);
    const deletedChild = children.pop();
    deletedChild?.remove();
    children = Array.from(tileContainer.value.children);
    if (sidebar.value && !children.length) {
      await showSideBar();
    } else {
      await resize();
    }
  });

  const changeAspectRatio = $(async (ratio: AspectRatio) => {
    aspectRatio.value = ratio;
    await resize();
  });


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

          {showAdvancedLayoutOptions.value  &&
            <button class={`button  ${sidebar.value ? 'is-active' : ''}`} onClick$={showSideBar}>
              <MaterialSymbolsSpaceDashboardOutlineSharp/>
            </button>
          }
          {showAdvancedLayoutOptions.value &&
            <button class={`button  ${spotlight.value ? 'is-active' : ''}`} onClick$={makeSpotlight}>
              <MaterialSymbolsLightCropLandscapeOutline/>
            </button>
          }

          {aspectRatios.map((ratio, index) => (
            <button key={index}
                    class={`button ${aspectRatio.value?.ratioClass === ratio.ratioClass ? 'is-active' : ''}`}
                    onClick$={() => changeAspectRatio(ratio)}>
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
