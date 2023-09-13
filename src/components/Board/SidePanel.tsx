'use client';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useState } from 'react';
import Users from '../SidePanel/Users';
import Activity from '../SidePanel/Activity';
import useUIStore from '@/store/uiStore';
import Filters from '../SidePanel/Filters';

const SidePanel = () => {
  const [sidePanelOpen, toggleSidePanel] = useUIStore((state) => [
    state.sidePanelOpen,
    state.toggleSidePanel,
  ]);

  let [options] = useState({
    Filters: Filters,
    Users: Users,
    Activity: Activity,
  });

  return (
    <aside
      className={classNames(
        'h-screen overflow-y-auto transition-all duration-300 ease-in-out bg-gray-100 fixed z-50 lg:z-30 lg:sticky right-0 top-0 lg:top-24 lg:translate-x-0 lg:transform p-4',
        sidePanelOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Side Panel  */}
      <div className="w-full flex mb-4 items-center justify-end">
        <button onClick={toggleSidePanel} className="text-red-500 lg:hidden">
          <AiFillCloseCircle className="h-6 w-6" />
        </button>
      </div>

      <div className="w-80">
        <Tab.Group>
          <Tab.List className="w-full flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {Object.keys(options).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'hover:bg-white/[0.12]'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="w-full mt-2">
            {Object.values(options).map((OptionTab, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames('w-full rounded-xl bg-white')}
              >
                <OptionTab />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </aside>
  );
};

export default SidePanel;
