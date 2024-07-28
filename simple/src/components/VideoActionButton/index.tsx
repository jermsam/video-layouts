import {component$, Slot} from '@builder.io/qwik';

export default component$(() => {

    return (
        <button class={'video-action-button'}>
          <Slot/>
        </button>
    )
});


