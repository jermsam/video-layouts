import {component$} from '@builder.io/qwik';
import {
  AntDesignFolderOutlined, MaterialSymbolsHardDriveOutlineSharp,
  MaterialSymbolsHomeOutline,
  MdiMessageReplyOutline,
  SolarPhoneCallingOutline,
  SolarSettingsOutline,
  TeenyiconsUsersOutline,

} from '~/components/icons';

export default component$(() => {

  return (
    <div class="navigation">
      <div class={'nav-link'}>
        <MaterialSymbolsHomeOutline class={'w-6 h-6'}/>
      </div>
      <div class={'nav-link mt-8'}>
        <MdiMessageReplyOutline class={'w-6 h-6'}/>
      </div>
      <div class={'nav-link mt-8'}>
        <SolarPhoneCallingOutline class={'w-6 h-6'}/>
      </div>
      <div class={'nav-link mt-8'}>
        <MaterialSymbolsHardDriveOutlineSharp class={'w-6 h-6'}/>
      </div>
      <div class={'nav-link mt-8'}>
        <TeenyiconsUsersOutline class={'w-6 h-6'}/>
      </div>
      <div class={'nav-link mt-8'}>
        <AntDesignFolderOutlined class={'w-6 h-6'}/>
      </div>
      <div class={'nav-link mt-8'}>
        <SolarSettingsOutline class={'w-6 h-6'}/>
      </div>
    </div>
  );
});


