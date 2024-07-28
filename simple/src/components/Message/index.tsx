import { component$ } from '@builder.io/qwik';
import type {Participant} from '~/routes';
import {BxDiamond} from '~/components/icons';

export interface File {
  src: string;
  size: number;
  name: string;
}

export interface MessageProp {
  from: Participant;
  message?: string;
  file?: File;
  mention?:string;
}

export default component$<MessageProp>((props) => {

    return (
      <div class="flex">
        { props.from.image && <div class="profile-picture">
          <img
            width={100}
            height={100}
            class={'w-full h-full object-center object-cover'}
            src={props.from.image}
            alt={props.from.name}
          />
        </div>
        }
        <div class="message-content">
          <p class="name">{props.from.name}</p>
          <div class="message">
            {props.file ? 'New design document ⬇️': props.message}
            <p class={'text-xs text-[#7c80fd]'}>{props.mention}</p>
          </div>
          {
            props.file && (
              <div class="message-file">
                <div class="icon sketch">
                  <BxDiamond/>
                </div>
                <div class="file-info">
                  <div class="file-name">{props.file.name}</div>
                  <div class="file-size">{props.file.size} MB</div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    )
});


