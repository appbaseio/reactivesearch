import { Actions, helper } from "@appbaseio/reactivecore";
import Container from "../../styles/Container";
import { connect } from "../../utils/index";
import Title from "../../styles/Title";
import Slider from "../../styles/Slider";
import types from "../../utils/vueTypes";
import VueTypes from "vue-types";
import vueSlider from 'vue-slider-component'

const {
  addComponent,
  removeComponent,
  watchComponent,
  updateQuery,
  setQueryListener,
  setQueryOptions
} = Actions;

const { isEqual, checkValueChange, getClassName, pushToAndClause } = helper;

const RangeSlider = { 
 
  name: "RangeSlider",
  components: {
    vueSlider
  },
  data(){
    this.state = {
    currentValue: [this.$props.range.start, this.$props.range.end],
    stats:[]
  }
  this.locked = false;
    return this.state;
  },

  props:{
    beforeValueChange: types.func,
    className: VueTypes.string.def(""),
    range: VueTypes.shape({
      start: VueTypes.integer.def(0),
      end: VueTypes.integer.def(10),
    }),
    componentId: types.stringRequired,
    customQuery: types.func,
    data: types.data,
    dataField: types.stringRequired,
    defaultSelected: types.string,
    filterLabel: types.string,
    innerClass: types.style,
    react: types.react,
    showFilter: VueTypes.bool.def(true),
    showCheckbox: VueTypes.bool.def(true),
    title: types.title,
    URLParams: VueTypes.bool.def(false)
  },

  methods:{

    setReact(props) {
      if (props.react) {
        this.watchComponent(props.componentId, props.react);
      }
    },
    handleSlider(values){ 
      if (!isEqual(values.currentValue, this.state.currentValue)) {
        this.handleChange(values.currentValue);
      }
    },

    handleChange(currentValue, props = this.$props){
      if(props.beforeValueChange && this.locked) {
        return;
      }
      this.locked = true;

      const performUpdate = () => {
        this.updateQueryHandler([currentValue[0], currentValue[1]], props);
        this.locked = false;
        this.$emit('valueChange',{ start: currentValue[0], end: currentValue[1] });
      };

      checkValueChange(
        props.componentId,
        {
          start: currentValue[0],
          end: currentValue[1],
        },
        props.beforeValueChange,
        performUpdate
      );
    },

    updateQueryHandler(value, props){

      const query = props.customQuery || RangeSlider.defaultQuery;
      const {
        showFilter,
        range: { start, end },
      } = props;

      const [currentStart, currentEnd] = value;
      const isInitialValue = currentStart === start && currentEnd === end;

      this.updateQuery({
        componentId: props.componentId,
        query: query(value, props),
        value,
        label: props.filterLabel,
        showFilter: showFilter && !isInitialValue,
        URLParams: props.URLParams,
        componentType: 'RANGESLIDER',
      });
    }

  },
  watch:{
    react() {
      this.setReact(this.$props);
    },
    defaultSelected(newVal) {
      this.selectItem(newVal);
    }
  },

  created(){
    const onQueryChange = (...args) => {
      this.$emit("queryChange", ...args);
    };
    this.setQueryListener(this.$props.componentId, onQueryChange, null);
  },
  beforeMount(){
    this.addComponent(this.$props.componentId);
    this.setReact(this.$props);
    if (this.selectedValue) {
      this.handleChange(this.selectedValue);
    } else if (this.$props.defaultSelected) {
      this.handleChange(this.$props.defaultSelected);
    }
  },
  beforeDestroy(){
    this.removeComponent(this.$props.componentId);
  },

  render(){
    return(
      <Container class={this.$props.className}>
          {this.$props.title && (
            <Title class={getClassName(this.$props.innerClass, "title")}>
              {this.$props.title}
            </Title>
          )}

        <Slider class={getClassName(this.$props.innerClass, "slider")}>
          <vue-slider ref="slider" value={this.state.currentValue} min={this.$props.range.start} max={this.$props.range.end} onDrag-end={this.handleSlider}></vue-slider>
        </Slider>
      </Container>
    )
  }
}

RangeSlider.defaultQuery = (values, props) => {
  if (Array.isArray(values) && values.length) {
      return {
        range: {
          [props.dataField]: {
            gte: values[0],
            lte: values[1],
            boost: 2.0,
          },
        },
      };
    }
    return null;
}

const mapStateToProps = (state, props) => ({
  options: state.aggregations[props.componentId]
    ? state.aggregations[props.componentId][props.dataField]
      && state.aggregations[props.componentId][props.dataField].buckets // eslint-disable-line
    : [],
  selectedValue: state.selectedValues[props.componentId]
    ? state.selectedValues[props.componentId].value
    : null,
});

const mapDispatchtoProps = {
  addComponent,
  removeComponent,
  updateQuery,
  watchComponent,
  setQueryListener
};

const RangeConnected = connect(
  mapStateToProps,
  mapDispatchtoProps
)(RangeSlider);

RangeSlider.install = function(Vue) {
  Vue.component(RangeSlider.name, RangeConnected);
};
export default RangeSlider;



