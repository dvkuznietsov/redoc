import { observer } from 'mobx-react';
import * as React from 'react';

import { FieldDetails } from './FieldDetails';
import { ShelfIcon } from '../../common-elements/';
import { Schema } from '../Schema/Schema';

import type { SchemaOptions } from '../Schema/Schema';
import type { FieldModel } from '../../services/models';

import classNames from 'classnames';

import './Fields.css';

export interface FieldProps extends SchemaOptions {
  className?: string;
  isLast?: boolean;
  showExamples?: boolean;

  field: FieldModel;
  expandByDefault?: boolean;

  renderDiscriminatorSwitch?: (opts: FieldProps) => JSX.Element;
}

@observer
export class Field extends React.Component<FieldProps> {
  toggle = () => {
    if (this.props.field.expanded === undefined && this.props.expandByDefault) {
      this.props.field.collapse();
    } else {
      this.props.field.toggle();
    }
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  };

  render() {
    const { className = '', field, isLast, expandByDefault } = this.props;
    const { name, deprecated, required, kind } = field;
    const withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;

    const expanded = field.expanded === undefined ? expandByDefault : field.expanded;

    const labels = (
      <>
        {kind === 'additionalProperties' && (
          <span className="text secondary">additional property</span>
        )}
        {kind === 'patternProperties' && <span className="text secondary">pattern property</span>}
        {required && <span className="text secondary">required</span>}
        <span>
          {field.schema.typePrefix && (
            <span className="text secondary">{field.schema.typePrefix}</span>
          )}
          <span className="text secondary">{field.schema.displayType}</span>
        </span>
        {field.schema.displayFormat && (
          <span className="text secondary">{field.schema.displayFormat}</span>
        )}
        {field.schema.contentEncoding && (
          <span className="text secondary">{field.schema.contentEncoding}</span>
        )}
        {field.schema.contentMediaType && (
          <span className="text secondary">{field.schema.contentMediaType}</span>
        )}
      </>
    );

    const availability = field.schema.rawSchema['x-databricks-availability'];

    const paramName = withSubSchema ? (
      <div className={classNames('property-name-cell', 'clickable-property-name-cell')}>
        <label
          onClick={this.toggle}
          onKeyPress={this.handleKeyPress}
          aria-label="expand properties"
        >
          <span className="text code" id={field.path}>
            {name}
          </span>
          <ShelfIcon direction={expanded ? 'down' : 'right'} />
        </label>
        {labels}
        {availability && <span className="text info">{availability} preview</span>}
      </div>
    ) : (
      <div className={classNames(deprecated ? 'deprecated' : undefined, 'property-name-cell')}>
        <span className="text code" id={field.path}>
          {name}
        </span>
        {labels}
      </div>
    );

    return (
      <>
        <div
          className={classNames(isLast ? 'last ' + className : className, 'properies-row', {
            'properies-row-show-border': !(expanded && withSubSchema),
          })}
        >
          {paramName}
          <FieldDetails {...this.props} />
        </div>
        {expanded && withSubSchema && (
          <div className="nested-row">
            <Schema
              schema={field.schema}
              skipReadOnly={this.props.skipReadOnly}
              skipWriteOnly={this.props.skipWriteOnly}
              showTitle={this.props.showTitle}
              level={this.props.level}
            />
          </div>
        )}
      </>
    );
  }
}
