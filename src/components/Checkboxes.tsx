/**
 * @file Checkboxes
 * @description 多选输入框
 * @author fex
 */

import React from 'react';
import uncontrollable from 'uncontrollable';
import Checkbox from './Checkbox';
import chunk from 'lodash/chunk';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {Option, value2array, Options} from './Select';
import find from 'lodash/find';
import {autobind, findTree} from '../utils/helper';
// import isPlainObject from 'lodash/isPlainObject';

export interface CheckboxesProps extends ThemeProps {
  options: Options;
  className?: string;
  placeholder?: string;
  value?: Array<any>;
  onChange?: (value: Array<Option>) => void;
  inline?: boolean;
  labelClassName?: string;
  option2value?: (option: Option) => any;
  itemClassName?: string;
  itemRender: (option: Option) => JSX.Element;

  disabled?: boolean;
}

export class Checkboxes<
  T extends CheckboxesProps = CheckboxesProps,
  S = any
> extends React.Component<T, S> {
  static defaultProps = {
    placeholder: '暂无选项',
    itemRender: (option: Option) => <span>{option.label}</span>
  };

  static value2array(
    value: any,
    options: Options,
    option2value: (option: Option) => any = (option: Option) => option
  ): Options {
    if (value === void 0) {
      return [];
    }

    if (!Array.isArray(value)) {
      value = [value];
    }

    return value.map((value: any) => {
      const option = findTree(
        options,
        option => option2value(option) === value
      );
      return option || value;
    });
  }

  toggleOption(option: Option) {
    const {value, onChange, option2value, options} = this.props;

    if (option.disabled) {
      return;
    }

    let valueArray = Checkboxes.value2array(value, options, option2value);
    let idx = valueArray.indexOf(option);

    if (~idx) {
      valueArray.splice(idx, 1);
    } else {
      valueArray.push(option);
    }

    let newValue: string | Array<Option> = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    onChange && onChange(newValue);
  }

  @autobind
  toggleAll() {
    const {value, onChange, option2value, options} = this.props;
    let valueArray: Array<Option> = [];

    if (!Array.isArray(value) || !value.length) {
      valueArray = options.filter(option => !option.disabled);
    }

    let newValue: string | Array<Option> = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    onChange && onChange(newValue);
  }

  render() {
    const {
      value,
      options,
      className,
      placeholder,
      inline,
      labelClassName,
      disabled,
      classnames: cx,
      option2value,
      itemClassName,
      itemRender
    } = this.props;

    let valueArray = Checkboxes.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => (
        <Checkbox
          className={cx(itemClassName, option.className)}
          key={key}
          onChange={() => this.toggleOption(option)}
          checked={!!~valueArray.indexOf(option)}
          disabled={disabled || option.disabled}
          labelClassName={labelClassName}
          description={option.description}
        >
          {itemRender(option)}
        </Checkbox>
      ));
    }

    return (
      <div
        className={cx(
          'Checkboxes',
          className,
          inline ? 'Checkboxes--inline' : ''
        )}
      >
        {body && body.length ? body : <div>{placeholder}</div>}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(Checkboxes, {
    value: 'onChange'
  })
);
