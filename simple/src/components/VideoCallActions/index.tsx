import { component$ } from '@builder.io/qwik';
import VideoActionButton from '~/components/VideoActionButton';
import {
  FlowbiteMicrophoneSlashOutline,
  IconParkOutlineFullScreen,
  IconParkOutlinePhoneMissed,
  MdiCameraOffOutline,
  SolarMagniferZoomInOutline, SolarMagniferZoomOutOutline,
} from '~/components/icons';

export default component$(() => {

    return (
        <div class={'video-call-actions'}>
            <VideoActionButton>
                <FlowbiteMicrophoneSlashOutline class={'w-4 lg:w-8 h-4 lg:h-8'}/>
            </VideoActionButton>
            <VideoActionButton>
                <MdiCameraOffOutline class={'w-4 lg:w-8 h-4 lg:h-8'}/>
            </VideoActionButton>
          <VideoActionButton>
            <IconParkOutlineFullScreen class={'w-4 lg:w-8 h-4 lg:h-8'}/>
          </VideoActionButton>
          <VideoActionButton>
            <div class={'flex items-center justify-center gap-1 text-red-500 px-1'}>
              <IconParkOutlinePhoneMissed class={'w-4 lg:w-8 h-4 lg:h-8'}/>
              <p class={'text-xs lg:text-md lg:font-bold lg:text-xl'}>Leave</p>
            </div>
          </VideoActionButton>
          <VideoActionButton>
            <div class={'flex items-center justify-center gap-1 px-1'}>
              <SolarMagniferZoomInOutline class={'w-4 lg:w-8 h-4 lg:h-8'}/>
              <p class={'text-xs lg:text-md lg:font-bold lg:text-xl'}>100%</p>
              <SolarMagniferZoomOutOutline class={'w-4 lg:w-8 h-4 lg:h-8'}/>
            </div>
          </VideoActionButton>
        </div>
    )
});


