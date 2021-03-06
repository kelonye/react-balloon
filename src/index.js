import React, { Component, PropTypes } from 'react';
import Resizable from 'react-resizable-and-movable';

export default class Balloon extends Component {
  static propTypes = {
    box: PropTypes.object,
    pointer: PropTypes.object,
    backgroundColor: PropTypes.string,
    zIndex: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    marker: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.any,
    style: PropTypes.object,
    onBoxDragStart: PropTypes.func,
    onBoxDrag: PropTypes.func,
    onBoxDragStop: PropTypes.func,
    onBoxResizeStart: PropTypes.func,
    onBoxResize: PropTypes.func,
    onBoxResizeStop: PropTypes.func,
    onPointerDragStart: PropTypes.func,
    onPointerDrag: PropTypes.func,
    onPointerDragStop: PropTypes.func,
    disable: PropTypes.bool,
    onClick: PropTypes.func,
    strokeColor: PropTypes.string,
  };

  static defaultProps = {
    box: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    pointer: {
      x: 0,
      y: 0,
    },
    marker: <div style={{ width: '30px', height: '30px' }} />,
    backgroundColor: '#f5f5f5',
    strokeColor: '#f5f5f5',
    zIndex: 100,
    className: '',
    style: {},
    onBoxDragStart: () => null,
    onBoxDrag: () => null,
    onBoxDragStop: () => null,
    onBoxResizeStart: () => null,
    onBoxResize: () => null,
    onBoxResizeStop: () => null,
    onPointerDragStart: () => null,
    onPointerDrag: () => null,
    onPointerDragStop: () => null,
    disable: false,
    onClick: () => null,
  };

  constructor(props) {
    super(props);
    const { box, pointer } = this.props;
    const pointerState = this.getPointer(box, pointer);
    this.state = {
      pointer: pointerState,
      box: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      },
      maxHeight: this.props.maxHeight,
      maxWidth: this.props.maxWidth,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { box, pointer } = nextProps;
    const pointerState = this.getPointer(box, pointer);
    this.state = {
      pointer: pointerState,
      box: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      },
      maxHeight: this.props.maxHeight,
      maxWidth: this.props.maxWidth,
    };
  }

  onBoxResize(_, { width, height }) {
    const { box: { x, y }, pointer: { destination } } = this.state;
    const toBottomBoundary = this.refs.wrapper.clientHeight - y;
    const toRightBoundary = this.refs.wrapper.clientWidth - x;
    const maxHeight = (toBottomBoundary < this.props.maxHeight || !this.props.maxHeight)
            ? toBottomBoundary
            : this.props.maxHeight;
    const maxWidth = (toRightBoundary < this.props.maxWidth || !this.props.maxWidth)
            ? toRightBoundary
            : this.props.maxWidth;
    const box = { x, y, width, height };
    const pointerState = this.getPointer(box, destination);
    this.setState({
      pointer: pointerState,
      box,
      maxHeight,
      maxWidth,
    });
    this.props.onBoxResize({ width, height });
  }

  onBoxDrag(e, { position }) {
    const { box: { width, height }, pointer: { destination } } = this.state;
    const x = position.left;
    const y = position.top;
    const box = { x, y, width, height };
    const pointerState = this.getPointer(box, destination);
    this.setState({
      pointer: pointerState,
      box,
    });
    this.props.onBoxDrag(position);
  }

  onBoxDragStop(e, { position }) {
    this.props.onBoxDragStop(position);
  }

  onPointerDrag(e, { position }) {
    const { box } = this.state;
    const destination = { x: position.left + 15, y: position.top + 15 };
    const pointerState = this.getPointer(box, destination);
    this.setState({ pointer: pointerState });
    this.props.onPointerDrag(position);
  }

  onPointerDragStop(e, { position }) {
    this.props.onPointerDragStop(position);
  }

  getBoxCenter(box) {
    return {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    };
  }

  getPointerType(origin, destination) {
    const degree = this.getDegree(origin, destination);
    if (degree >= -45 && degree < 45) return 'right';
    if (degree >= 45 && degree < 135) return 'top';
    if ((degree >= 135 && degree <= 180) || (degree >= -180 && degree < -135)) return 'left';
    return 'bottom';
  }

  getDegree(origin, destination) {
    const x = destination.x - origin.x;
    const y = origin.y - destination.y;
    const rad = Math.atan2(y, x);
    if (isNaN(rad)) return 0;
    return rad * 360 / (2 * Math.PI);
  }

  getPointer(box, destination) {
    const boxCenter = this.getBoxCenter(box);
    const type = this.getPointerType(boxCenter, destination);
    return this.calculatePointer(destination, box, type);
  }

  calculatePointer(destination, box, type) {
    let base;
    let control;
    const { x, y, width, height } = box;

    switch (type) {
      case 'top' :
        base = [
          { x: x + width * 0.25, y: y + 1 },
          { x: x + width * 0.75, y: y + 1 },
        ];
        control = { x: x + width * 0.5, y };
        break;
      case 'right' :
        base = [
          { x: x + width - 1, y: y + height * 0.25 },
          { x: x + width - 1, y: y + height * 0.75 },
        ];
        control = { x: x + width, y: y + height * 0.5 };
        break;
      case 'bottom' :
        base = [
          { x: x + width * 0.25, y: y + height - 1 },
          { x: x + width * 0.75, y: y + height - 1 },
        ];
        control = { x: x + width * 0.5, y: y + height };
        break;
      case 'left' :
        base = [
          { x, y: y + height * 0.25 },
          { x, y: y + height * 0.75 },
        ];
        control = { x, y: y + height * 0.5 };
        break;
      default:
        base = [
          { x: x + width, y: y + height * 0.25 },
          { x: x + width, y: y + height * 0.75 },
        ];
        control = { x: x + width, y: y + height * 0.5 };
        break;
    }

    return {
      base,
      control,
      destination,
    };
  }

  render() {
    const { box, pointer, backgroundColor, zIndex, minWidth, minHeight,
            marker, className, children, style, onPointerDragStart,
            onBoxDragStart, onBoxResizeStart, onBoxResizeStop, disable, strokeColor } = this.props;
    const { base, destination, control } = this.state.pointer;
    const { maxHeight, maxWidth } = this.state;
    const cursor = disable ? { cursor: 'default' } : {};
    return (
      <div
        ref="wrapper"
        className={className}
        style={{
          width: '100%',
          height: '100%',
          zIndex,
          position: 'absolute',
          pointerEvents: 'auto',
        }}
      >
        <Resizable
          x={ box.x }
          y={ box.y }
          width={ box.width }
          height={ box.height }
          style={{
            ...cursor,
            ...style,
            backgroundColor,
            pointerEvents: 'auto',
            position: 'absolute',
          }}
          moveAxis={ this.props.disable ? 'none' : 'both' }
          isResizable={
            this.props.disable
              ? {
                top: false,
                right: false,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: false,
                topLeft: false,
                bottomLeft: false,
              } : {
                top: false,
                right: true,
                bottom: true,
                left: false,
                topRight: false,
                bottomRight: true,
                topLeft: false,
                bottomLeft: false,
              }
          }
          onDragStart={ onBoxDragStart }
          onDrag={ ::this.onBoxDrag }
          onDragStop={ ::this.onBoxDragStop }
          onResizeStart={ onBoxResizeStart }
          onResize={ ::this.onBoxResize }
          onResizeStop={ onBoxResizeStop }
          bounds="parent"
          zIndex={ zIndex }
          maxHeight={ maxHeight }
          maxWidth={ maxWidth }
          minHeight={ minHeight }
          minWidth={ minWidth }
        >
          <div style={{ padding: '0px', width: '100%', height: '100%', pointerEvents: 'auto' }}>
            { children }
          </div>
        </Resizable>
        <Resizable
          x={pointer.x}
          y={pointer.y - 15}
          width={10}
          height={10}
          style={ Object.assign({}, { pointerEvents: 'auto', ...cursor }) }
          onDragStart={ onPointerDragStart }
          onDrag={ ::this.onPointerDrag }
          onDragStop={ ::this.onPointerDragStop }
          bounds="parent"
          moveAxis={ this.props.disable ? 'none' : 'both' }
          isResizable={{
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            topLeft: false,
            bottomLeft: false,
          }}
          zIndex={zIndex}
        >
          { marker }
        </Resizable>
        <svg width="100%" height="100%" style={{ zIndex, pointerEvents: 'auto' }}>
          <path
            d={ `M ${base[0].x} ${base[0].y}
                 Q ${control.x} ${control.y} ${destination.x} ${destination.y}
                 Q ${control.x} ${control.y} ${base[1].x} ${base[1].y}`}
            fill={ backgroundColor }
            stroke={ strokeColor }
            strokeWidth={ 1 }
          />
        </svg>
      </div>
    );
  }
}
