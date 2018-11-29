import { Actions, helper } from "@appbaseio/reactivecore";
import Container from "../../styles/Container";
import { connect } from "../../utils/index";
import Title from "../../styles/Title";
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
    setReact(){},
    onCallback(value){ 
      // console.log('value',value);
    },
    end(x){
      console.log('x',x.currentValue)
    }
    
  },
  watch:{
  },

  created(){

  },
  beforeMount(){

  },
  beforeDestroy(){

  },

  render(){
    return(
    <Container class={this.$props.className}>
        {this.$props.title && (
          <Title class={getClassName(this.$props.innerClass, "title")}>
          </Title>
        )}
        <vue-slider ref="slider" value={this.state.currentValue} min={this.$props.range.start} max={this.$props.range.end} onCallback={this.onCallback} onDrag-end={this.end}></vue-slider>
    </Container>
    )
  }
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



