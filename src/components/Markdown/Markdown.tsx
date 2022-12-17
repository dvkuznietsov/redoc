import * as React from 'react';
import styled from 'styled-components';

import { MarkdownRenderer } from '../../services';
import { SanitizedMarkdownHTML } from './SanitizedMdBlock';
import { jsonStyles } from '../JsonViewer/style';
export interface StylingMarkdownProps {
  compact?: boolean;
  inline?: boolean;
}

export interface BaseMarkdownProps {
  sanitize?: boolean;
  source: string;
}

export type MarkdownProps = BaseMarkdownProps &
  StylingMarkdownProps & {
    source: string;
    className?: string;
    'data-role'?: string;
  };

export class MarkdownUnstyled extends React.Component<MarkdownProps> {
  render() {
    const { source, inline, compact, className, 'data-role': dataRole } = this.props;
    const renderer = new MarkdownRenderer();
    return (
      <SanitizedMarkdownHTML
        html={renderer.renderMd(source)}
        inline={inline}
        compact={compact}
        className={className}
        data-role={dataRole}
      />
    );
  }
}

export const Markdown = styled(MarkdownUnstyled)`
  .redoc-json {
    ${jsonStyles};
    .collapser {
      display: none;
      pointer-events: none;
    }
    code {
      border: none;
      background: none;
    }
    padding: 10px;
    border: 1px solid ${props => props.theme.codeBlock.borderColor};
    border-radius: 4px;
  }
`;
