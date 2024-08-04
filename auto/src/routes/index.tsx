import {
  $,
  component$,
  useOnDocument,
  useOnWindow,
  useSignal,
} from '@builder.io/qwik';
import type {DocumentHead} from '@builder.io/qwik-city';
import { Link} from '@builder.io/qwik-city';
import {
  AntDesignGithubOutlined,
  Fa6SolidPlus,
  MaterialSymbolsDelete,
  MaterialSymbolsDesktopWindowsRounded,
  MaterialSymbolsLightCropLandscapeOutline,
  MaterialSymbolsSpaceDashboardOutlineSharp,
} from '~/components/icons';
import {resize} from '~/utils';

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
  const aspectRatio = useSignal<AspectRatio>({
    ratio: 16 / 9,
    label: '16:9',
    ratioClass: 'aspect-[16/9]',
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
    resize(tileContainer.value,margin,aspectRatio.value);
    showAdvancedLayoutOptions.value = (((sidebar.value) ? 0 : 1) < tileContainer.value.children.length) || spotlight.value || sidebar.value;
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
      console.log('wait....');
      tileContainer.value.appendChild(thumbnail);
    }
    container.value.removeChild(screen);
    tileContainer.value.appendChild(screen);
    resize(tileContainer.value,margin,aspectRatio.value);
  })

  const addScreen = $(async (screenToAdd: HTMLElement) => {
    if ( !tileContainer.value || !container.value) return;
    tileContainer.value.removeChild(screenToAdd)
    const tileContainerComputedStyle = getComputedStyle(tileContainer.value);
    const tileContainerPaddingY =
      parseInt(tileContainerComputedStyle.paddingTop.replace('px', ''), 10) +
      parseInt(tileContainerComputedStyle.paddingBottom.replace('px', ''), 10);
    const screenHeight = tileContainer.value.offsetHeight - tileContainerPaddingY;
    screenToAdd.style.height = `${screenHeight}px`;
    screenToAdd.id = 'screen';
    container.value.innerHTML = '';
    container.value.appendChild(screenToAdd);
    tileContainer.value.style.maxHeight = `${screenHeight}px`;
    container.value.appendChild(tileContainer.value);
    resize(tileContainer.value,margin,aspectRatio.value);
  })


  const showSideBar = $(async () => {
    if (!tileContainer.value || !container.value) return;

    sidebar.value = !sidebar.value;
    if (sidebar.value) {
      if(spotlight.value) {
        const screen = document.getElementById('screen') as HTMLElement;
        const thumbnail = screen.querySelector('div') as HTMLElement;
        tileContainer.value.appendChild(thumbnail)
        await removeScreen();
        spotlight.value = false;
      }
      const children = Array.from(tileContainer.value.children) as HTMLElement[];
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
      }
      // eslint-disable-next-line prefer-const
      thumbnail = children.pop() as HTMLElement
      tileContainer.value.removeChild(thumbnail)
      screen.style.width = '100%';
      screen.classList.add('relative')

      console.log(thumbnail)
      thumbnail.style.width='320px'
      const ratio = aspectRatio.value.ratio as number
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
      resize(tileContainer.value,margin,aspectRatio.value);
    }
  });

  const changeAspectRatio = $(async (ratio: AspectRatio) => {
    if (!tileContainer.value) return;
    aspectRatio.value = ratio;
    resize(tileContainer.value,margin,aspectRatio.value);
  });


  useOnDocument('DOMContentLoaded', addParticipantCamera);
  useOnWindow('resize', $(()=>{
    if (!tileContainer.value) return;
    resize(tileContainer.value,margin,aspectRatio.value);
  }));

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
                    class={`button ${aspectRatio.value.ratioClass === ratio.ratioClass ? 'is-active' : ''}`}
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
