import React, {
  FC,
  Ref,
  CSSProperties,
  useRef,
  useState,
  useCallback,
} from "react";

import { observer } from "mobx-react-lite";

import { Manager, Reference, Popper } from "react-popper";

import AsyncSelect from "react-select/async";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

import type { AlertStore } from "Stores/AlertStore";
import type { Settings } from "Stores/Settings";
import type { APIGridT } from "Models/APITypes";
import { CommonPopperModifiers } from "Common/Popper";
import { NewLabelName, StringToOption, OptionT } from "Common/Select";
import { DropdownSlide } from "Components/Animations/DropdownSlide";
import { ThemeContext } from "Components/Theme";
import { useOnClickOutside } from "Hooks/useOnClickOutside";

const specialLabels: OptionT[] = [
  { label: "Automatic selection", value: "@auto" },
  { label: "@alertmanager", value: "@alertmanager" },
  { label: "@cluster", value: "@cluster" },
  { label: "@receiver", value: "@receiver" },
];

const NullContainer: FC = () => null;

const GridLabelNameSelect: FC<{
  alertStore: AlertStore;
  settingsStore: Settings;
  grid: APIGridT;
  onClose: () => void;
}> = ({ alertStore, settingsStore, grid, onClose }) => {
  const loadOptions = (
    inputValue: string,
    callback: (options: OptionT[]) => void
  ) => {
    const autoEnabled =
      settingsStore.multiGridConfig.config.gridLabel === "@auto";
    const options = [
      ...specialLabels.filter(
        (val) =>
          val.value !== "@auto" || (val.value === "@auto" && !autoEnabled)
      ),
      ...alertStore.data.labelNames
        .filter(
          (labelName) =>
            autoEnabled === true ||
            (autoEnabled === false && labelName !== grid.labelName)
        )
        .sort()
        .map((key) => StringToOption(key)),
    ];

    callback(options);
  };

  const context = React.useContext(ThemeContext);

  return (
    <AsyncSelect
      styles={context.reactSelectStyles}
      classNamePrefix="react-select"
      formatCreateLabel={NewLabelName}
      loadOptions={loadOptions}
      defaultOptions
      onChange={(option: OptionT) => {
        settingsStore.multiGridConfig.setGridLabel(option.value);
        onClose();
      }}
      menuIsOpen={true}
      components={{
        ClearIndicator: null,
        IndicatorSeparator: null,
        DropdownIndicator: null,
        ValueContainer: NullContainer,
        Control: NullContainer,
      }}
    />
  );
};

const Dropdown: FC<{
  popperPlacement?: string;
  popperRef?: Ref<HTMLDivElement>;
  popperStyle?: CSSProperties;
  alertStore: AlertStore;
  settingsStore: Settings;
  grid: APIGridT;
  onClose: () => void;
}> = ({
  popperPlacement,
  popperRef,
  popperStyle,
  alertStore,
  settingsStore,
  grid,
  onClose,
}) => {
  return (
    <div
      className="dropdown-menu d-block shadow components-grid-label-select-menu border-0 p-0 m-0"
      ref={popperRef}
      style={{
        fontSize: "1rem",
        fontWeight: "normal",
        ...popperStyle,
      }}
      data-placement={popperPlacement}
    >
      <GridLabelNameSelect
        alertStore={alertStore}
        settingsStore={settingsStore}
        grid={grid}
        onClose={onClose}
      />
    </div>
  );
};

const GridLabelSelect: FC<{
  alertStore: AlertStore;
  settingsStore: Settings;
  grid: APIGridT;
}> = observer(({ alertStore, settingsStore, grid }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const hide = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, hide, isVisible);

  return (
    <div ref={ref} className="components-label badge ps-1 pe-2">
      <Manager>
        <Reference>
          {({ ref }) => (
            <span
              ref={ref}
              onClick={toggle}
              className="border-0 rounded-0 bg-inherit cursor-pointer px-1 py-0 components-grid-label-select-dropdown"
              data-toggle="dropdown"
            >
              <FontAwesomeIcon className="text-muted" icon={faCaretDown} />
            </span>
          )}
        </Reference>
        <DropdownSlide in={isVisible} unmountOnExit>
          <Popper placement="bottom" modifiers={CommonPopperModifiers}>
            {({ placement, ref, style }) => (
              <Dropdown
                popperPlacement={placement}
                popperRef={ref}
                popperStyle={style}
                alertStore={alertStore}
                settingsStore={settingsStore}
                grid={grid}
                onClose={toggle}
              />
            )}
          </Popper>
        </DropdownSlide>
      </Manager>
    </div>
  );
});

export { GridLabelSelect };
