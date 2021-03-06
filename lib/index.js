'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactResizableAndMovable = require('react-resizable-and-movable');

var _reactResizableAndMovable2 = _interopRequireDefault(_reactResizableAndMovable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Balloon = function (_Component) {
  _inherits(Balloon, _Component);

  function Balloon(props) {
    _classCallCheck(this, Balloon);

    var _this = _possibleConstructorReturn(this, (Balloon.__proto__ || Object.getPrototypeOf(Balloon)).call(this, props));

    var _this$props = _this.props,
        box = _this$props.box,
        pointer = _this$props.pointer;

    var pointerState = _this.getPointer(box, pointer);
    _this.state = {
      pointer: pointerState,
      box: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height
      },
      maxHeight: _this.props.maxHeight,
      maxWidth: _this.props.maxWidth
    };
    return _this;
  }

  _createClass(Balloon, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var box = nextProps.box,
          pointer = nextProps.pointer;

      var pointerState = this.getPointer(box, pointer);
      this.state = {
        pointer: pointerState,
        box: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height
        },
        maxHeight: this.props.maxHeight,
        maxWidth: this.props.maxWidth
      };
    }
  }, {
    key: 'onBoxResize',
    value: function onBoxResize(_, _ref) {
      var width = _ref.width,
          height = _ref.height;
      var _state = this.state,
          _state$box = _state.box,
          x = _state$box.x,
          y = _state$box.y,
          destination = _state.pointer.destination;

      var toBottomBoundary = this.refs.wrapper.clientHeight - y;
      var toRightBoundary = this.refs.wrapper.clientWidth - x;
      var maxHeight = toBottomBoundary < this.props.maxHeight || !this.props.maxHeight ? toBottomBoundary : this.props.maxHeight;
      var maxWidth = toRightBoundary < this.props.maxWidth || !this.props.maxWidth ? toRightBoundary : this.props.maxWidth;
      var box = { x: x, y: y, width: width, height: height };
      var pointerState = this.getPointer(box, destination);
      this.setState({
        pointer: pointerState,
        box: box,
        maxHeight: maxHeight,
        maxWidth: maxWidth
      });
      this.props.onBoxResize({ width: width, height: height });
    }
  }, {
    key: 'onBoxDrag',
    value: function onBoxDrag(e, _ref2) {
      var position = _ref2.position;
      var _state2 = this.state,
          _state2$box = _state2.box,
          width = _state2$box.width,
          height = _state2$box.height,
          destination = _state2.pointer.destination;

      var x = position.left;
      var y = position.top;
      var box = { x: x, y: y, width: width, height: height };
      var pointerState = this.getPointer(box, destination);
      this.setState({
        pointer: pointerState,
        box: box
      });
      this.props.onBoxDrag(position);
    }
  }, {
    key: 'onBoxDragStop',
    value: function onBoxDragStop(e, _ref3) {
      var position = _ref3.position;

      this.props.onBoxDragStop(position);
    }
  }, {
    key: 'onPointerDrag',
    value: function onPointerDrag(e, _ref4) {
      var position = _ref4.position;
      var box = this.state.box;

      var destination = { x: position.left + 15, y: position.top + 15 };
      var pointerState = this.getPointer(box, destination);
      this.setState({ pointer: pointerState });
      this.props.onPointerDrag(position);
    }
  }, {
    key: 'onPointerDragStop',
    value: function onPointerDragStop(e, _ref5) {
      var position = _ref5.position;

      this.props.onPointerDragStop(position);
    }
  }, {
    key: 'getBoxCenter',
    value: function getBoxCenter(box) {
      return {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2
      };
    }
  }, {
    key: 'getPointerType',
    value: function getPointerType(origin, destination) {
      var degree = this.getDegree(origin, destination);
      if (degree >= -45 && degree < 45) return 'right';
      if (degree >= 45 && degree < 135) return 'top';
      if (degree >= 135 && degree <= 180 || degree >= -180 && degree < -135) return 'left';
      return 'bottom';
    }
  }, {
    key: 'getDegree',
    value: function getDegree(origin, destination) {
      var x = destination.x - origin.x;
      var y = origin.y - destination.y;
      var rad = Math.atan2(y, x);
      if (isNaN(rad)) return 0;
      return rad * 360 / (2 * Math.PI);
    }
  }, {
    key: 'getPointer',
    value: function getPointer(box, destination) {
      var boxCenter = this.getBoxCenter(box);
      var type = this.getPointerType(boxCenter, destination);
      return this.calculatePointer(destination, box, type);
    }
  }, {
    key: 'calculatePointer',
    value: function calculatePointer(destination, box, type) {
      var base = void 0;
      var control = void 0;
      var x = box.x,
          y = box.y,
          width = box.width,
          height = box.height;


      switch (type) {
        case 'top':
          base = [{ x: x + width * 0.25, y: y + 1 }, { x: x + width * 0.75, y: y + 1 }];
          control = { x: x + width * 0.5, y: y };
          break;
        case 'right':
          base = [{ x: x + width - 1, y: y + height * 0.25 }, { x: x + width - 1, y: y + height * 0.75 }];
          control = { x: x + width, y: y + height * 0.5 };
          break;
        case 'bottom':
          base = [{ x: x + width * 0.25, y: y + height - 1 }, { x: x + width * 0.75, y: y + height - 1 }];
          control = { x: x + width * 0.5, y: y + height };
          break;
        case 'left':
          base = [{ x: x, y: y + height * 0.25 }, { x: x, y: y + height * 0.75 }];
          control = { x: x, y: y + height * 0.5 };
          break;
        default:
          base = [{ x: x + width, y: y + height * 0.25 }, { x: x + width, y: y + height * 0.75 }];
          control = { x: x + width, y: y + height * 0.5 };
          break;
      }

      return {
        base: base,
        control: control,
        destination: destination
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          box = _props.box,
          pointer = _props.pointer,
          backgroundColor = _props.backgroundColor,
          zIndex = _props.zIndex,
          minWidth = _props.minWidth,
          minHeight = _props.minHeight,
          marker = _props.marker,
          className = _props.className,
          children = _props.children,
          style = _props.style,
          onPointerDragStart = _props.onPointerDragStart,
          onBoxDragStart = _props.onBoxDragStart,
          onBoxResizeStart = _props.onBoxResizeStart,
          onBoxResizeStop = _props.onBoxResizeStop,
          disable = _props.disable,
          strokeColor = _props.strokeColor;
      var _state$pointer = this.state.pointer,
          base = _state$pointer.base,
          destination = _state$pointer.destination,
          control = _state$pointer.control;
      var _state3 = this.state,
          maxHeight = _state3.maxHeight,
          maxWidth = _state3.maxWidth;

      var cursor = disable ? { cursor: 'default' } : {};
      return _react2.default.createElement(
        'div',
        {
          ref: 'wrapper',
          className: className,
          style: {
            width: '100%',
            height: '100%',
            zIndex: zIndex,
            position: 'absolute',
            pointerEvents: 'auto'
          }
        },
        _react2.default.createElement(
          _reactResizableAndMovable2.default,
          {
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            style: _extends({}, cursor, style, {
              backgroundColor: backgroundColor,
              pointerEvents: 'auto',
              position: 'absolute'
            }),
            moveAxis: this.props.disable ? 'none' : 'both',
            isResizable: this.props.disable ? {
              top: false,
              right: false,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              topLeft: false,
              bottomLeft: false
            } : {
              top: false,
              right: true,
              bottom: true,
              left: false,
              topRight: false,
              bottomRight: true,
              topLeft: false,
              bottomLeft: false
            },
            onDragStart: onBoxDragStart,
            onDrag: this.onBoxDrag.bind(this),
            onDragStop: this.onBoxDragStop.bind(this),
            onResizeStart: onBoxResizeStart,
            onResize: this.onBoxResize.bind(this),
            onResizeStop: onBoxResizeStop,
            bounds: 'parent',
            zIndex: zIndex,
            maxHeight: maxHeight,
            maxWidth: maxWidth,
            minHeight: minHeight,
            minWidth: minWidth
          },
          _react2.default.createElement(
            'div',
            { style: { padding: '0px', width: '100%', height: '100%', pointerEvents: 'auto' } },
            children
          )
        ),
        _react2.default.createElement(
          _reactResizableAndMovable2.default,
          {
            x: pointer.x,
            y: pointer.y - 15,
            width: 10,
            height: 10,
            style: _extends({}, _extends({ pointerEvents: 'auto' }, cursor)),
            onDragStart: onPointerDragStart,
            onDrag: this.onPointerDrag.bind(this),
            onDragStop: this.onPointerDragStop.bind(this),
            bounds: 'parent',
            moveAxis: this.props.disable ? 'none' : 'both',
            isResizable: {
              top: false,
              right: false,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              topLeft: false,
              bottomLeft: false
            },
            zIndex: zIndex
          },
          marker
        ),
        _react2.default.createElement(
          'svg',
          { width: '100%', height: '100%', style: { zIndex: zIndex, pointerEvents: 'auto' } },
          _react2.default.createElement('path', {
            d: 'M ' + base[0].x + ' ' + base[0].y + '\n                 Q ' + control.x + ' ' + control.y + ' ' + destination.x + ' ' + destination.y + '\n                 Q ' + control.x + ' ' + control.y + ' ' + base[1].x + ' ' + base[1].y,
            fill: backgroundColor,
            stroke: strokeColor,
            strokeWidth: 1
          })
        )
      );
    }
  }]);

  return Balloon;
}(_react.Component);

Balloon.propTypes = {
  box: _react.PropTypes.object,
  pointer: _react.PropTypes.object,
  backgroundColor: _react.PropTypes.string,
  zIndex: _react.PropTypes.number,
  minWidth: _react.PropTypes.number,
  minHeight: _react.PropTypes.number,
  maxWidth: _react.PropTypes.number,
  maxHeight: _react.PropTypes.number,
  marker: _react.PropTypes.object,
  className: _react.PropTypes.string,
  children: _react.PropTypes.any,
  style: _react.PropTypes.object,
  onBoxDragStart: _react.PropTypes.func,
  onBoxDrag: _react.PropTypes.func,
  onBoxDragStop: _react.PropTypes.func,
  onBoxResizeStart: _react.PropTypes.func,
  onBoxResize: _react.PropTypes.func,
  onBoxResizeStop: _react.PropTypes.func,
  onPointerDragStart: _react.PropTypes.func,
  onPointerDrag: _react.PropTypes.func,
  onPointerDragStop: _react.PropTypes.func,
  disable: _react.PropTypes.bool,
  onClick: _react.PropTypes.func,
  strokeColor: _react.PropTypes.string
};
Balloon.defaultProps = {
  box: {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  },
  pointer: {
    x: 0,
    y: 0
  },
  marker: _react2.default.createElement('div', { style: { width: '30px', height: '30px' } }),
  backgroundColor: '#f5f5f5',
  strokeColor: '#f5f5f5',
  zIndex: 100,
  className: '',
  style: {},
  onBoxDragStart: function onBoxDragStart() {
    return null;
  },
  onBoxDrag: function onBoxDrag() {
    return null;
  },
  onBoxDragStop: function onBoxDragStop() {
    return null;
  },
  onBoxResizeStart: function onBoxResizeStart() {
    return null;
  },
  onBoxResize: function onBoxResize() {
    return null;
  },
  onBoxResizeStop: function onBoxResizeStop() {
    return null;
  },
  onPointerDragStart: function onPointerDragStart() {
    return null;
  },
  onPointerDrag: function onPointerDrag() {
    return null;
  },
  onPointerDragStop: function onPointerDragStop() {
    return null;
  },
  disable: false,
  onClick: function onClick() {
    return null;
  }
};
exports.default = Balloon;
module.exports = exports['default'];