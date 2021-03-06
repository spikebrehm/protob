var goog = require('./google-protos-defn');
/**
 * A collection of encoding functions that act on a value and encode it in wire format
 * @module protob
 * @namespace encoders
 * @exports encoders
 */
var Protob = require('../protob').Protob,
    ByteBuffer = require('../protob').ByteBuffer,
    EnumValue = require('../enum').EnumValue;

var encoders = {
  /**
   * Encode an int32
   * @function TYPE_INT32
   * @param {object} field - The field object
   * @param {integer} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_INT32: function(field, value, buffer){ buffer.writeVarint32(value); },

  /**
   * Encode an uint32
   * @function TYPE_UINT32
   * @param {object} field - The field object
   * @param {integer} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_UINT32: function(field, value, buffer){ buffer.writeVarint32(value); },

  /**
   * Encode an sint32 field
   * @function TYPE_SINT32
   * @param {object} field - The field object
   * @param {integer} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_SINT32: function(field, value, buffer) { buffer.writeZigZagVarint32(value); },

  /**
   * Encode an fixed32 field
   * @function TYPE_FIXED32
   * @param {object} field - The field object
   * @param {number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_FIXED32: function(field, value, buffer) { buffer.writeUint32(value); },

  /**
   * Encode an sfixed32 field
   * @function TYPE_SFIXED32
   * @param {object} field - The field object
   * @param {number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_SFIXED32: function(field, value, buffer) { buffer.writeInt32(value); },

  /**
   * Encode an int64 field
   * @function TYPE_INT64
   * @param {object} field - The field object
   * @param {Long|number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_INT64: function(field, value, buffer) { buffer.writeVarint64(value); },

  /**
   * Encode an uint64 field
   * @function TYPE_UINT64
   * @param {object} field - The field object
   * @param {Long|number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_UINT64: function(field, value, buffer) { buffer.writeVarint64(value); },

  /**
   * Encode an sint64 field
   * @function TYPE_SINT64
   * @param {object} field - The field object
   * @param {Long|number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_SINT64: function(field, value, buffer) { buffer.writeZigZagVarint64(value); },

  /**
   * Encode an fixed64 field
   * @function TYPE_FIXED64
   * @param {object} field - The field object
   * @param {Long|number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_FIXED64: function(field, value, buffer) { buffer.writeUint64(value); },

  /**
   * Encode an sfixed64 field
   * @function TYPE_SFIXED64
   * @param {object} field - The field object
   * @param {Long|number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_SFIXED64: function(field, value, buffer) { buffer.writeInt64(value); },

  /**
   * Encode an bool field
   * @function TYPE_BOOL
   * @param {object} field - The field object
   * @param {true|false} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_BOOL: function(field, value, buffer) { buffer.writeVarint32(value ? 1 : 0); },

  /**
   * Encode an float field
   * @function TYPE_FLOAT
   * @param {object} field - The field object
   * @param {number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_FLOAT: function(field, value, buffer) { buffer.writeFloat32(value); },

  /**
   * Encode an double field
   * @function TYPE_DOUBLE
   * @param {object} field - The field object
   * @param {number} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_DOUBLE: function(field, value, buffer) { buffer.writeFloat64(value); },

  /**
   * Encode an string field
   * @function TYPE_STRING
   * @param {object} field - The field object
   * @param {string} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_STRING: function(field, value, buffer) { buffer.writeVString(value); },

  /**
   * Encode an enum field
   * @function TYPE_ENUM
   * @param {object} field - The field object
   * @param {EnumValue|integer} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_ENUM: function(field, value, buffer) {
    if(value instanceof EnumValue) {
      buffer.writeVarint32(value.number);
    } else {
      buffer.writeVarint32(value);
    }
  },

  /**
   * Encode an bytes field
   * @function TYPE_BYTES
   * @param {object} field - The field object
   * @param {ByteBuffer} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_BYTES: function(field, value, buffer) {
    if (value.offset > value.length) { // Forgot to flip?
      buffer = buffer.clone().flip();
    }
    buffer.writeVarint32(value.remaining());
    buffer.append(value);
    value.offset = 0;
  },

  /**
   * Encode a message field
   * @function TYPE_MESSAGE
   * @param {object} field - The field object
   * @param {Protob.Message} value - The unencoded value of the field
   * @param {ByteBuffer} buffer - The buffer to write the encoded value into
   * @protected
   */
  TYPE_MESSAGE: function(field, value, buffer) {
    if ( !value ) { return; }
    if ( !( value instanceof field.descriptor.concrete ) ) {
      value = new field.descriptor.concrete(value);
    }
    var bb = value.encode().toBuffer();

    buffer.writeVarint32(bb.length);
    buffer.append(bb);
  },

  addFieldEncoders: function() {
    var registry = require('../registry');
        FD = registry.lookup('google.protobuf.FieldDescriptorProto');

    FD.prototype.encode = function(value, buffer) {
      this.encode = specificFieldEncoder(this);
      return this.encode(value, buffer);
    }
  }
};

function specificFieldEncoder(field) {
  var registry = require('../registry'),
      fd = goog.fieldDescriptorProto,
      fo = goog.fieldOptions,
      constructor = field.constructor,
      Protob = require('../protob').Protob,
      repeated = field.repeated,
      fieldType = field.fieldType,
      encoder = encoders[fieldType],
      tag = field[fd.NUMBER] << 3,
      fieldWireType = Protob.TYPES[fieldType].wireType,
      packed = field[fd.OPTIONS] && field[fd.OPTIONS][fo.PACKED];

  if ( fieldType === null ) { throw(new Error("[INTERNAL] Unresolved type in "+field[fd.NAME]+": "+fieldType)); }

  if( repeated ) {
    if (packed) {
      return function(value, buffer) {
        if (value === null || value === undefined || !value || !value.length) return buffer; // Optional omitted
        buffer.writeVarint32(tag | Protob.WIRE_TYPES.LDELIM);
        buffer.ensureCapacity(buffer.offset += 1); // We do not know the length yet, so let's assume a varint of length 1
        var start = buffer.offset; // Remember where the contents begin
        value.forEach(function(v) { encoder(field, v, buffer); });

        var len = buffer.offset-start;
        var varintLen = ByteBuffer.calculateVarint32(len);
        if (varintLen > 1) { // We need to move the contents
          var contents = buffer.slice(start, buffer.offset);
          start += varintLen-1;
          buffer.offset = start;
          buffer.append(contents);
        }
        buffer.writeVarint32(len, start-varintLen);
        return buffer;
      };
    } else {
      // Repeated, but not packed
      return function(value, buffer) {
        var self = this;
        if (value === null || value === undefined || !value || !value.length) return buffer; // Optional omitted
        // "If your message definition has repeated elements (without the [packed=true] option), the encoded
        // message has zero or more key-value pairs with the same tag number"
        value.forEach(function(val){
          buffer.writeVarint32(tag | fieldWireType);
          encoder(self, val, buffer);
        });
        return buffer;
      };
    }
  } else {
    // Not Repeated
    return function(value, buffer) {
      if (value === null || value === undefined) return buffer; // Optional omitted
      buffer.writeVarint32(tag | fieldWireType);
      encoder(this, value, buffer);
      return buffer;
    };
  }
}


module.exports.encoders = encoders;
