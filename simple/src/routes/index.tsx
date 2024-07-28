import {$, component$, useSignal, useStore} from '@builder.io/qwik';
import type { DocumentHead } from "@builder.io/qwik-city";
import ModeSwitch from '~/components/ModeSwitch';
import Navigation from '~/components/Navigation';
import VideoCallActions from '~/components/VideoCallActions';
import {
  FlowbiteMicrophoneSlashOutline, MaterialSymbolsCancelOutlineRounded,
  MaterialSymbolsChatBubbleOutline, MaterialSymbolsVideocamOutline,
  MdiCameraOffOutline, TablerSend,
} from '~/components/icons';
import Message from '~/components/Message';

export interface Participant {
  videoOn: boolean,
  audioOn: boolean,
  image: string,
  name: string,
  id: number,
}

export default component$(() => {
  const participants = useStore<Participant[]>([
    {
      id:1,
      videoOn: false,
      audioOn: false,
      image: 'https://images.unsplash.com/photo-1566821582776-92b13ab46bb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
      name:'Andy Will'
    },
    {
      id:2,
      videoOn: false,
      audioOn: false,
      image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
      name:'Emmy Lou'
    },
    {
      id:3,
      videoOn: false,
      audioOn: false,
      image: 'https://images.unsplash.com/photo-1576110397661-64a019d88a98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80',
      name:'Tim Russel'
    },
    {
      id:4,
      videoOn: false,
      audioOn: false,
      image: 'https://images.unsplash.com/photo-1600207438283-a5de6d9df13e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80',
      name:'Jessica Bell'
    },
    {
      id:5,
      videoOn: false,
      audioOn: false,
      image: 'https://images.unsplash.com/photo-1581824283135-0666cf353f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1276&q=80',
      name:'Ryan Patric'
    },
    {
      id:6,
      videoOn: false,
      audioOn: false,
      image: 'https://images.unsplash.com/photo-1542596594-649edbc13630?ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80',
      name:'Tina Kate'
    },
  ])

  const messages = useStore([
    {
      from: participants[1],
      message: 'Helloo team!😍'
    },
    {
      from: participants[0],
      message: 'Hello! Can you hear me?🤯',
      mention:'@ryanpatrick'
    },
    {
      from: participants[3],
      message: 'Hi team! Let\'s get started it.',
    },
    {
      from: participants[2],
      file: {
        name: 'NewYear.sketch',
        size: 120,
        src: 'http:looks.com/ger.pdf'
      },
    },
    {
      from: participants[5],
      message: 'I downloaded the file',
      mention:'@timrussel'
    },
    {
      from: participants[4],
      message: 'Hey guys ! Sorry I am ;late'
    },
    {
      from: participants[1],
      message: `Everyone's here, let's get started!`
    },
  ])

  const container = useSignal<HTMLElement>()
  const rightMenuTransitionClass = useSignal<string>('translate-x-0')
  const expandButtonClass = useSignal<string>('hidden lg:flex')

  const openRight = $(()=>{
    rightMenuTransitionClass.value = 'translate-x-0 lg:translate-x-0'
    expandButtonClass.value = 'hidden lg:flex'
  })

  const closeRight = $(()=>{
    rightMenuTransitionClass.value = 'translate-x-full lg:translate-x-0'
    expandButtonClass.value = 'flex'
  })

  return (
    <div class={'app-container'}>
      <ModeSwitch/>
      <div class="left-side">
        <Navigation/>
      </div>
      <div class={`app-main ${expandButtonClass.value}`}>
        <div class={'video-call-wrapper bg-amber-400'} ref={container}>
          {
            participants.map(participant => (
              <div key={participant.id} class={` h-[33.33%] lg:h-[50%] relative m-0 w-[50%] lg:w-[33.33%]`}>
                <img width={380} height={400} src={participant.image} class={'w-full h-full object-cover'}
                     alt={participant.name}/>
                <div class={'absolute text-xs text-white bg-[rgba(0,15,47,0.5)] rounded px-3 py-1 right-3 bottom-3'}>
                  {participant.name}
                </div>
                <div class={'absolute flex left-3 top-3 gap-2'}>
                  <button class={'btn-mute'}>
                    <FlowbiteMicrophoneSlashOutline class={'w-3 lg:w-6 h-3 lg:h-6'}/>
                  </button>

                  <button class={'btn-mute'}>
                    <MdiCameraOffOutline class={'w-3 lg:w-6 h-3 lg:h-6'}/>
                  </button>
                </div>
              </div>
            ))
          }

        </div>
        <VideoCallActions/>
      </div>
      <button class={`expand-button ${expandButtonClass.value}`} onClick$={openRight}>
        <MaterialSymbolsChatBubbleOutline/>
      </button>
      <div class={`right-side ${rightMenuTransitionClass.value}`}>
        <div class={'chat-container'}>
          <div class={'chat-header'}>
            <button class="chat-header-button">
              <MaterialSymbolsVideocamOutline/>
              Live Chat
            </button>
            <button class={'btn-close-right'}
                    onClick$={closeRight}>
              <MaterialSymbolsCancelOutlineRounded class={'w-6 h-6'}/>
            </button>
          </div>
          <div class={'chat-area flex flex-col gap-8'}>
            {
              messages.map((message, index) => (
                <Message key={index} {...message}/>
              ))
            }
          </div>
          <div class={'p-4'}>
            <div class={'chat-typing-area'}>
              <input placeholder={'Type your message ...'} class={'chat-input'}/>
              <button class="send-button">
                <TablerSend/>
              </button>
            </div>
          </div>
        </div>
        <div class={'participants'}>
          {
            participants.slice(0,4).map((participant,index)=> (
              <div key={index} class="profile-picture">
                <img
                  width={100}
                  height={100}
                  class={'w-full h-full object-center object-cover'}
                  src={participant.image}
                  alt={participant.name}
                />
              </div>
            ))
          }
          <div class="profile-picture bg-gray-200 flex items-center justify-center cursor-pointer">
            2+
          </div>
        </div>
      </div>
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
