export const mockDataSearchFull = `<pre style='color:#000020;'><span style='color:#200080; font-weight:bold; '>import</span> React<span style='color:#308080; '>,</span> <span style='color:#406080; '>{</span> Component <span style='color:#406080; '>}</span> from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>react</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>
<span style='color:#200080; font-weight:bold; '>import</span> <span style='color:#406080; '>{</span> connect <span style='color:#406080; '>}</span> from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>react-redux</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>
<span style='color:#200080; font-weight:bold; '>import</span> Downshift from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>downshift</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>

<span style='color:#200080; font-weight:bold; '>import</span> <span style='color:#406080; '>{</span>
	addComponent<span style='color:#308080; '>,</span>
	removeComponent<span style='color:#308080; '>,</span>
	watchComponent<span style='color:#308080; '>,</span>
	updateQuery<span style='color:#308080; '>,</span>
	setQueryOptions
<span style='color:#406080; '>}</span> from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>@appbaseio/reactivecore/lib/actions</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>
<span style='color:#200080; font-weight:bold; '>import</span> <span style='color:#406080; '>{</span>
	debounce<span style='color:#308080; '>,</span>
	pushToAndClause<span style='color:#308080; '>,</span>
	checkValueChange<span style='color:#308080; '>,</span>
	checkPropChange<span style='color:#308080; '>,</span>
	checkSomePropChange<span style='color:#308080; '>,</span>
	getClassName
<span style='color:#406080; '>}</span> from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>@appbaseio/reactivecore/lib/utils/helper</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>

<span style='color:#200080; font-weight:bold; '>import</span> types from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>@appbaseio/reactivecore/lib/utils/types</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>
<span style='color:#200080; font-weight:bold; '>import</span> Title from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>../../styles/Title</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>
<span style='color:#200080; font-weight:bold; '>import</span> Input<span style='color:#308080; '>,</span> <span style='color:#406080; '>{</span> suggestionsContainer<span style='color:#308080; '>,</span> suggestions <span style='color:#406080; '>}</span> from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>../../styles/Input</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>
<span style='color:#200080; font-weight:bold; '>import</span> SearchSvg from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>../shared/SearchSvg</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>
<span style='color:#200080; font-weight:bold; '>import</span> Flex from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>../../styles/Flex</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>

<span style='color:#200080; font-weight:bold; '>import</span> <span style='color:#406080; '>{</span> getSuggestions <span style='color:#406080; '>}</span> from <span style='color:#800000; '>"</span><span style='color:#1060b6; '>../../utils</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>

<span style='color:#200080; font-weight:bold; '>class</span> DataSearch <span style='color:#200080; font-weight:bold; '>extends</span> Component <span style='color:#406080; '>{</span>
	<span style='color:#007d45; '>constructor</span><span style='color:#308080; '>(</span>props<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>super</span><span style='color:#308080; '>(</span>props<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state <span style='color:#308080; '>=</span> <span style='color:#406080; '>{</span>
			currentValue<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
			suggestions<span style='color:#406080; '>:</span> <span style='color:#308080; '>[</span><span style='color:#308080; '>]</span><span style='color:#308080; '>,</span>
			isOpen<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>false</span>
		<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>internalComponent <span style='color:#308080; '>=</span> props<span style='color:#308080; '>.</span>componentId <span style='color:#308080; '>+</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>__internal</span><span style='color:#800000; '>"</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span>

	componentWillMount<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>addComponent<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>addComponent<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>internalComponent<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>highlight<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>const</span> queryOptions <span style='color:#308080; '>=</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>highlightQuery<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>setQueryOptions<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>,</span> queryOptions<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setReact<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>selectedValue<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setValue<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>selectedValue<span style='color:#308080; '>,</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span> <span style='color:#200080; font-weight:bold; '>else</span> <span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>defaultSelected<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setValue<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>defaultSelected<span style='color:#308080; '>,</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
	<span style='color:#406080; '>}</span>

	componentWillReceiveProps<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
		checkSomePropChange<span style='color:#308080; '>(</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>,</span>
			nextProps<span style='color:#308080; '>,</span>
			<span style='color:#308080; '>[</span><span style='color:#800000; '>"</span><span style='color:#1060b6; '>highlight</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>dataField</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>highlightField</span><span style='color:#800000; '>"</span><span style='color:#308080; '>]</span><span style='color:#308080; '>,</span>
			<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
				<span style='color:#200080; font-weight:bold; '>const</span> queryOptions <span style='color:#308080; '>=</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>highlightQuery<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
				<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>setQueryOptions<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>,</span> queryOptions<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
			<span style='color:#406080; '>}</span>
		<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

		checkPropChange<span style='color:#308080; '>(</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>react<span style='color:#308080; '>,</span>
			nextProps<span style='color:#308080; '>.</span>react<span style='color:#308080; '>,</span>
			<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setReact<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>)</span>
		<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#007d45; '>Array</span><span style='color:#308080; '>.</span>isArray<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>.</span>suggestions<span style='color:#308080; '>)</span> <span style='color:#308080; '>&amp;&amp;</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue<span style='color:#308080; '>.</span>trim<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span><span style='color:#308080; '>.</span><span style='color:#200080; font-weight:bold; '>length</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			checkPropChange<span style='color:#308080; '>(</span>
				<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>suggestions<span style='color:#308080; '>,</span>
				nextProps<span style='color:#308080; '>.</span>suggestions<span style='color:#308080; '>,</span>
				<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
					<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setState<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
						suggestions<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>onSuggestions<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>.</span>suggestions<span style='color:#308080; '>)</span>
					<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
				<span style='color:#406080; '>}</span>
			<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>

		checkSomePropChange<span style='color:#308080; '>(</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>,</span>
			nextProps<span style='color:#308080; '>,</span>
			<span style='color:#308080; '>[</span><span style='color:#800000; '>"</span><span style='color:#1060b6; '>fieldWeights</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>fuzziness</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>queryFormat</span><span style='color:#800000; '>"</span><span style='color:#308080; '>]</span><span style='color:#308080; '>,</span>
			<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
				<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>updateQuery<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>,</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue<span style='color:#308080; '>,</span> nextProps<span style='color:#308080; '>)</span>
			<span style='color:#406080; '>}</span>
		<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>defaultSelected <span style='color:#308080; '>!==</span> nextProps<span style='color:#308080; '>.</span>defaultSelected<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setValue<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>.</span>defaultSelected<span style='color:#308080; '>,</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>,</span> nextProps<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span> <span style='color:#200080; font-weight:bold; '>else</span> <span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>selectedValue <span style='color:#308080; '>!==</span> nextProps<span style='color:#308080; '>.</span>selectedValue <span style='color:#308080; '>&amp;&amp;</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue <span style='color:#308080; '>!==</span> nextProps<span style='color:#308080; '>.</span>selectedValue
		<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#595979; '>// check for selected value prop change or selectedValue will never match currentValue</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setValue<span style='color:#308080; '>(</span>nextProps<span style='color:#308080; '>.</span>selectedValue <span style='color:#308080; '>||</span> <span style='color:#800000; '>"</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>,</span> nextProps<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
	<span style='color:#406080; '>}</span>

	componentWillUnmount<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>removeComponent<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>removeComponent<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>internalComponent<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span>

	setReact <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>props<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>const</span> <span style='color:#406080; '>{</span> react <span style='color:#406080; '>}</span> <span style='color:#308080; '>=</span> props<span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>react<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>const</span> newReact <span style='color:#308080; '>=</span> pushToAndClause<span style='color:#308080; '>(</span>react<span style='color:#308080; '>,</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>internalComponent<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
			props<span style='color:#308080; '>.</span>watchComponent<span style='color:#308080; '>(</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>,</span> newReact<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span> <span style='color:#200080; font-weight:bold; '>else</span> <span style='color:#406080; '>{</span>
			props<span style='color:#308080; '>.</span>watchComponent<span style='color:#308080; '>(</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>,</span> <span style='color:#406080; '>{</span> and<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>internalComponent <span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	highlightQuery <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>props<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#308080; '>!</span>props<span style='color:#308080; '>.</span>highlight<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>return</span> <span style='color:#0f4d75; '>null</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
		<span style='color:#200080; font-weight:bold; '>const</span> fields <span style='color:#308080; '>=</span> <span style='color:#406080; '>{</span><span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>const</span> highlightField <span style='color:#308080; '>=</span> props<span style='color:#308080; '>.</span>highlightField <span style='color:#406080; '>?</span> props<span style='color:#308080; '>.</span>highlightField <span style='color:#406080; '>:</span> props<span style='color:#308080; '>.</span>dataField<span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>typeof</span> highlightField <span style='color:#308080; '>===</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>string</span><span style='color:#800000; '>"</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			fields<span style='color:#308080; '>[</span>highlightField<span style='color:#308080; '>]</span> <span style='color:#308080; '>=</span> <span style='color:#406080; '>{</span><span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span> <span style='color:#200080; font-weight:bold; '>else</span> <span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#007d45; '>Array</span><span style='color:#308080; '>.</span>isArray<span style='color:#308080; '>(</span>highlightField<span style='color:#308080; '>)</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			highlightField<span style='color:#308080; '>.</span>forEach<span style='color:#308080; '>(</span><span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>item</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
				fields<span style='color:#308080; '>[</span><span style='color:#200080; font-weight:bold; '>item</span><span style='color:#308080; '>]</span> <span style='color:#308080; '>=</span> <span style='color:#406080; '>{</span><span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>
			<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>

		<span style='color:#200080; font-weight:bold; '>return</span> <span style='color:#406080; '>{</span>
			highlight<span style='color:#406080; '>:</span> <span style='color:#406080; '>{</span>
				pre_tags<span style='color:#406080; '>:</span> <span style='color:#308080; '>[</span><span style='color:#800000; '>"</span><span style='color:#1060b6; '>&lt;mark></span><span style='color:#800000; '>"</span><span style='color:#308080; '>]</span><span style='color:#308080; '>,</span>
				post_tags<span style='color:#406080; '>:</span> <span style='color:#308080; '>[</span><span style='color:#800000; '>"</span><span style='color:#1060b6; '>&lt;/mark></span><span style='color:#800000; '>"</span><span style='color:#308080; '>]</span><span style='color:#308080; '>,</span>
				fields
			<span style='color:#406080; '>}</span>
		<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	defaultQuery <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>value<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>let</span> finalQuery <span style='color:#308080; '>=</span> <span style='color:#0f4d75; '>null</span><span style='color:#308080; '>,</span>
			fields<span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>value<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#007d45; '>Array</span><span style='color:#308080; '>.</span>isArray<span style='color:#308080; '>(</span>props<span style='color:#308080; '>.</span>dataField<span style='color:#308080; '>)</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
				fields <span style='color:#308080; '>=</span> props<span style='color:#308080; '>.</span>dataField<span style='color:#406080; '>;</span>
			<span style='color:#406080; '>}</span> <span style='color:#200080; font-weight:bold; '>else</span> <span style='color:#406080; '>{</span>
				fields <span style='color:#308080; '>=</span> <span style='color:#308080; '>[</span>props<span style='color:#308080; '>.</span>dataField<span style='color:#308080; '>]</span><span style='color:#406080; '>;</span>
			<span style='color:#406080; '>}</span>
			finalQuery <span style='color:#308080; '>=</span> <span style='color:#406080; '>{</span>
				bool<span style='color:#406080; '>:</span> <span style='color:#406080; '>{</span>
					should<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>shouldQuery<span style='color:#308080; '>(</span>value<span style='color:#308080; '>,</span> fields<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span><span style='color:#308080; '>,</span>
					minimum_should_match<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>1</span><span style='color:#800000; '>"</span>
				<span style='color:#406080; '>}</span>
			<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>

		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>value <span style='color:#308080; '>===</span> <span style='color:#800000; '>"</span><span style='color:#800000; '>"</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			finalQuery <span style='color:#308080; '>=</span> <span style='color:#406080; '>{</span>
				<span style='color:#800000; '>"</span><span style='color:#1060b6; '>match_all</span><span style='color:#800000; '>"</span><span style='color:#406080; '>:</span> <span style='color:#406080; '>{</span><span style='color:#406080; '>}</span>
			<span style='color:#406080; '>}</span>
		<span style='color:#406080; '>}</span>

		<span style='color:#200080; font-weight:bold; '>return</span> finalQuery<span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	shouldQuery <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>value<span style='color:#308080; '>,</span> dataFields<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>const</span> fields <span style='color:#308080; '>=</span> dataFields<span style='color:#308080; '>.</span>map<span style='color:#308080; '>(</span>
			<span style='color:#308080; '>(</span>field<span style='color:#308080; '>,</span> <span style='color:#007d45; '>index</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> "$<span style='color:#406080; '>{</span>field<span style='color:#406080; '>}</span>$<span style='color:#406080; '>{</span><span style='color:#308080; '>(</span><span style='color:#007d45; '>Array</span><span style='color:#308080; '>.</span>isArray<span style='color:#308080; '>(</span>props<span style='color:#308080; '>.</span>fieldWeights<span style='color:#308080; '>)</span> <span style='color:#308080; '>&amp;&amp;</span> props<span style='color:#308080; '>.</span>fieldWeights<span style='color:#308080; '>[</span><span style='color:#007d45; '>index</span><span style='color:#308080; '>]</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>?</span> <span style='color:#308080; '>(</span><span style='color:#800000; '>"</span><span style='color:#1060b6; '>^</span><span style='color:#800000; '>"</span> <span style='color:#308080; '>+</span> props<span style='color:#308080; '>.</span>fieldWeights<span style='color:#308080; '>[</span><span style='color:#007d45; '>index</span><span style='color:#308080; '>]</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#800000; '>"</span><span style='color:#406080; '>}</span>"
		<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>props<span style='color:#308080; '>.</span>queryFormat <span style='color:#308080; '>===</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>and</span><span style='color:#800000; '>"</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>return</span> <span style='color:#308080; '>[</span>
				<span style='color:#406080; '>{</span>
					multi_match<span style='color:#406080; '>:</span> <span style='color:#406080; '>{</span>
						query<span style='color:#406080; '>:</span> value<span style='color:#308080; '>,</span>
						fields<span style='color:#308080; '>,</span>
						type<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>cross_fields</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
						operator<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>and</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
						fuzziness<span style='color:#406080; '>:</span> props<span style='color:#308080; '>.</span>fuzziness <span style='color:#406080; '>?</span> props<span style='color:#308080; '>.</span>fuzziness <span style='color:#406080; '>:</span> <span style='color:#008c00; '>0</span>
					<span style='color:#406080; '>}</span>
				<span style='color:#406080; '>}</span><span style='color:#308080; '>,</span>
				<span style='color:#406080; '>{</span>
					multi_match<span style='color:#406080; '>:</span> <span style='color:#406080; '>{</span>
						query<span style='color:#406080; '>:</span> value<span style='color:#308080; '>,</span>
						fields<span style='color:#308080; '>,</span>
						type<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>phrase_prefix</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
						operator<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>and</span><span style='color:#800000; '>"</span>
					<span style='color:#406080; '>}</span>
				<span style='color:#406080; '>}</span>
			<span style='color:#308080; '>]</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>

		<span style='color:#200080; font-weight:bold; '>return</span> <span style='color:#308080; '>[</span>
			<span style='color:#406080; '>{</span>
				multi_match<span style='color:#406080; '>:</span> <span style='color:#406080; '>{</span>
					query<span style='color:#406080; '>:</span> value<span style='color:#308080; '>,</span>
					fields<span style='color:#308080; '>,</span>
					type<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>best_fields</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
					operator<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>or</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
					fuzziness<span style='color:#406080; '>:</span> props<span style='color:#308080; '>.</span>fuzziness <span style='color:#406080; '>?</span> props<span style='color:#308080; '>.</span>fuzziness <span style='color:#406080; '>:</span> <span style='color:#008c00; '>0</span>
				<span style='color:#406080; '>}</span>
			<span style='color:#406080; '>}</span><span style='color:#308080; '>,</span>
			<span style='color:#406080; '>{</span>
				multi_match<span style='color:#406080; '>:</span> <span style='color:#406080; '>{</span>
					query<span style='color:#406080; '>:</span> value<span style='color:#308080; '>,</span>
					fields<span style='color:#308080; '>,</span>
					type<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>phrase_prefix</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
					operator<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>or</span><span style='color:#800000; '>"</span>
				<span style='color:#406080; '>}</span>
			<span style='color:#406080; '>}</span>
		<span style='color:#308080; '>]</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	onSuggestions <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>suggestions<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onSuggestion<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>return</span> suggestions<span style='color:#308080; '>.</span>map<span style='color:#308080; '>(</span>suggestion <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onSuggestion<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>

		<span style='color:#200080; font-weight:bold; '>const</span> fields <span style='color:#308080; '>=</span> <span style='color:#007d45; '>Array</span><span style='color:#308080; '>.</span>isArray<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>dataField<span style='color:#308080; '>)</span> <span style='color:#406080; '>?</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>dataField <span style='color:#406080; '>:</span> <span style='color:#308080; '>[</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>dataField<span style='color:#308080; '>]</span><span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>return</span> getSuggestions<span style='color:#308080; '>(</span>
			fields<span style='color:#308080; '>,</span>
			suggestions<span style='color:#308080; '>,</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue<span style='color:#308080; '>.</span><span style='color:#200080; font-weight:bold; '>toLowerCase</span><span style='color:#308080; '>(</span><span style='color:#308080; '>)</span>
		<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	setValue <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>value<span style='color:#308080; '>,</span> isDefaultValue <span style='color:#308080; '>=</span> <span style='color:#0f4d75; '>false</span><span style='color:#308080; '>,</span> props <span style='color:#308080; '>=</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>const</span> performUpdate <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setState<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
				currentValue<span style='color:#406080; '>:</span> value
			<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
			<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>isDefaultValue<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
				<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>autoSuggest<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
					<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setState<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
						isOpen<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>false</span>
					<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
					<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>updateQuery<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>internalComponent<span style='color:#308080; '>,</span> value<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
				<span style='color:#406080; '>}</span>
				<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>updateQuery<span style='color:#308080; '>(</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>,</span> value<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
			<span style='color:#406080; '>}</span> <span style='color:#200080; font-weight:bold; '>else</span> <span style='color:#406080; '>{</span>
				<span style='color:#595979; '>// debounce for handling text while typing</span>
				<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>handleTextChange<span style='color:#308080; '>(</span>value<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
			<span style='color:#406080; '>}</span>
		<span style='color:#406080; '>}</span>
		checkValueChange<span style='color:#308080; '>(</span>
			props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>,</span>
			value<span style='color:#308080; '>,</span>
			props<span style='color:#308080; '>.</span>beforeValueChange<span style='color:#308080; '>,</span>
			props<span style='color:#308080; '>.</span>onValueChange<span style='color:#308080; '>,</span>
			performUpdate
		<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	handleTextChange <span style='color:#308080; '>=</span> debounce<span style='color:#308080; '>(</span><span style='color:#308080; '>(</span>value<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>autoSuggest<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>updateQuery<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>internalComponent<span style='color:#308080; '>,</span> value<span style='color:#308080; '>,</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span> <span style='color:#200080; font-weight:bold; '>else</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>updateQuery<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>,</span> value<span style='color:#308080; '>,</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
	<span style='color:#406080; '>}</span><span style='color:#308080; '>,</span> <span style='color:#008c00; '>300</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

	updateQuery <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>componentId<span style='color:#308080; '>,</span> value<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>const</span> query <span style='color:#308080; '>=</span> props<span style='color:#308080; '>.</span>customQuery <span style='color:#308080; '>||</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>defaultQuery<span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>let</span> onQueryChange <span style='color:#308080; '>=</span> <span style='color:#0f4d75; '>null</span><span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>componentId <span style='color:#308080; '>===</span> props<span style='color:#308080; '>.</span>componentId <span style='color:#308080; '>&amp;&amp;</span> props<span style='color:#308080; '>.</span>onQueryChange<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			onQueryChange <span style='color:#308080; '>=</span> props<span style='color:#308080; '>.</span>onQueryChange<span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
		props<span style='color:#308080; '>.</span>updateQuery<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
			componentId<span style='color:#308080; '>,</span>
			query<span style='color:#406080; '>:</span> query<span style='color:#308080; '>(</span>value<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span><span style='color:#308080; '>,</span>
			value<span style='color:#308080; '>,</span>
			label<span style='color:#406080; '>:</span> props<span style='color:#308080; '>.</span>filterLabel<span style='color:#308080; '>,</span>
			showFilter<span style='color:#406080; '>:</span> props<span style='color:#308080; '>.</span>showFilter<span style='color:#308080; '>,</span>
			onQueryChange<span style='color:#308080; '>,</span>
			URLParams<span style='color:#406080; '>:</span> props<span style='color:#308080; '>.</span>URLParams
		<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	handleFocus <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>event<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setState<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
			isOpen<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>true</span>
		<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onFocus<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onFocus<span style='color:#308080; '>(</span>event<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	<span style='color:#595979; '>// only works if there's a change in downshift's value</span>
	handleOuterClick <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setValue<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue<span style='color:#308080; '>,</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>)</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	handleKeyDown <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>event<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>event<span style='color:#308080; '>.</span>key <span style='color:#308080; '>===</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>Enter</span><span style='color:#800000; '>"</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			event<span style='color:#308080; '>.</span>target<span style='color:#308080; '>.</span>blur<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setValue<span style='color:#308080; '>(</span>event<span style='color:#308080; '>.</span>target<span style='color:#308080; '>.</span>value<span style='color:#308080; '>,</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onKeyDown<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onKeyDown<span style='color:#308080; '>(</span>event<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	onInputChange <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>e<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setState<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
			suggestions<span style='color:#406080; '>:</span> <span style='color:#308080; '>[</span><span style='color:#308080; '>]</span>
		<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setValue<span style='color:#308080; '>(</span>e<span style='color:#308080; '>.</span>target<span style='color:#308080; '>.</span>value<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	onSuggestionSelected <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>suggestion<span style='color:#308080; '>,</span> event<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setValue<span style='color:#308080; '>(</span>suggestion<span style='color:#308080; '>.</span>value<span style='color:#308080; '>,</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onBlur<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onBlur<span style='color:#308080; '>(</span>event<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	handleStateChange <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>changes<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>const</span> <span style='color:#406080; '>{</span> isOpen<span style='color:#308080; '>,</span> type <span style='color:#406080; '>}</span> <span style='color:#308080; '>=</span> changes<span style='color:#406080; '>;</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span>type <span style='color:#308080; '>===</span> Downshift<span style='color:#308080; '>.</span>stateChangeTypes<span style='color:#308080; '>.</span>mouseUp<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>setState<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
				isOpen
			<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
	<span style='color:#406080; '>}</span><span style='color:#406080; '>;</span>

	renderIcon <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>if</span> <span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>showIcon<span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
			<span style='color:#200080; font-weight:bold; '>return</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>icon <span style='color:#308080; '>||</span> <span style='color:#308080; '>&lt;</span>SearchSvg <span style='color:#308080; '>/</span><span style='color:#308080; '>></span><span style='color:#406080; '>;</span>
		<span style='color:#406080; '>}</span>
		<span style='color:#200080; font-weight:bold; '>return</span> <span style='color:#0f4d75; '>null</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span>

	render<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span> <span style='color:#406080; '>{</span>
		<span style='color:#200080; font-weight:bold; '>const</span> suggestionsList <span style='color:#308080; '>=</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue <span style='color:#308080; '>===</span> <span style='color:#800000; '>"</span><span style='color:#800000; '>"</span> <span style='color:#308080; '>||</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue <span style='color:#308080; '>===</span> <span style='color:#0f4d75; '>null</span>
			<span style='color:#406080; '>?</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>defaultSuggestions <span style='color:#308080; '>&amp;&amp;</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>defaultSuggestions<span style='color:#308080; '>.</span><span style='color:#200080; font-weight:bold; '>length</span>
				<span style='color:#406080; '>?</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>defaultSuggestions
				<span style='color:#406080; '>:</span> <span style='color:#308080; '>[</span><span style='color:#308080; '>]</span>
			<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>suggestions<span style='color:#406080; '>;</span>

		<span style='color:#200080; font-weight:bold; '>return</span> <span style='color:#308080; '>(</span>
			<span style='color:#308080; '>&lt;</span>div style<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>style<span style='color:#406080; '>}</span> className<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>className<span style='color:#406080; '>}</span><span style='color:#308080; '>></span>
				<span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>title <span style='color:#308080; '>&amp;&amp;</span> <span style='color:#308080; '>&lt;</span>Title className<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span>getClassName<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>innerClass<span style='color:#308080; '>,</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>title</span><span style='color:#800000; '>"</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>||</span> <span style='color:#0f4d75; '>null</span><span style='color:#406080; '>}</span><span style='color:#308080; '>></span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>title<span style='color:#406080; '>}</span><span style='color:#308080; '>&lt;</span><span style='color:#308080; '>/</span>Title<span style='color:#308080; '>></span><span style='color:#406080; '>}</span>
				<span style='color:#406080; '>{</span>
					<span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>autoSuggest
						<span style='color:#406080; '>?</span> <span style='color:#308080; '>(</span><span style='color:#308080; '>&lt;</span>Downshift
							onChange<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>onSuggestionSelected<span style='color:#406080; '>}</span>
							onOuterClick<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>handleOuterClick<span style='color:#406080; '>}</span>
							onStateChange<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>handleStateChange<span style='color:#406080; '>}</span>
							isOpen<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>isOpen<span style='color:#406080; '>}</span>
							itemToString<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span>i <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> i<span style='color:#406080; '>}</span>
							render<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
								getInputProps<span style='color:#308080; '>,</span>
								getItemProps<span style='color:#308080; '>,</span>
								isOpen<span style='color:#308080; '>,</span>
								highlightedIndex
							<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#308080; '>(</span>
								<span style='color:#308080; '>&lt;</span>div className<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span>suggestionsContainer<span style='color:#406080; '>}</span><span style='color:#308080; '>></span>
									<span style='color:#308080; '>&lt;</span>Flex showBorder<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>showIcon<span style='color:#406080; '>}</span> iconPosition<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>iconPosition<span style='color:#406080; '>}</span><span style='color:#308080; '>></span>
										<span style='color:#308080; '>&lt;</span>Input showIcon<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>showIcon<span style='color:#406080; '>}</span> <span style='color:#406080; '>{</span><span style='color:#308080; '>.</span><span style='color:#308080; '>.</span><span style='color:#308080; '>.</span>getInputProps<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
											className<span style='color:#406080; '>:</span> getClassName<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>innerClass<span style='color:#308080; '>,</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>input</span><span style='color:#800000; '>"</span><span style='color:#308080; '>)</span><span style='color:#308080; '>,</span>
											placeholder<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>placeholder<span style='color:#308080; '>,</span>
											value<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue <span style='color:#308080; '>===</span> <span style='color:#0f4d75; '>null</span> <span style='color:#406080; '>?</span> <span style='color:#800000; '>"</span><span style='color:#800000; '>"</span> <span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>state<span style='color:#308080; '>.</span>currentValue<span style='color:#308080; '>,</span>
											onChange<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>onInputChange<span style='color:#308080; '>,</span>
											onBlur<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onBlur<span style='color:#308080; '>,</span>
											onFocus<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>handleFocus<span style='color:#308080; '>,</span>
											onKeyPress<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onKeyPress<span style='color:#308080; '>,</span>
											onKeyDown<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>handleKeyDown<span style='color:#308080; '>,</span>
											onKeyUp<span style='color:#406080; '>:</span> <span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>onKeyUp
										<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>}</span> <span style='color:#308080; '>/</span><span style='color:#308080; '>></span>
										<span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>renderIcon<span style='color:#308080; '>(</span><span style='color:#308080; '>)</span><span style='color:#406080; '>}</span>
									<span style='color:#308080; '>&lt;</span><span style='color:#308080; '>/</span>Flex<span style='color:#308080; '>></span>
									<span style='color:#406080; '>{</span>
										isOpen <span style='color:#308080; '>&amp;&amp;</span> suggestionsList<span style='color:#308080; '>.</span><span style='color:#200080; font-weight:bold; '>length</span>
											<span style='color:#406080; '>?</span> <span style='color:#308080; '>(</span><span style='color:#308080; '>&lt;</span>div className<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span>suggestions<span style='color:#406080; '>}</span><span style='color:#308080; '>></span>
												<span style='color:#308080; '>&lt;</span>ul className<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span>getClassName<span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>this</span><span style='color:#308080; '>.</span>props<span style='color:#308080; '>.</span>innerClass<span style='color:#308080; '>,</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>list</span><span style='color:#800000; '>"</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>||</span> <span style='color:#0f4d75; '>null</span><span style='color:#406080; '>}</span><span style='color:#308080; '>></span>
													<span style='color:#406080; '>{</span>
														suggestionsList
															<span style='color:#308080; '>.</span>map<span style='color:#308080; '>(</span><span style='color:#308080; '>(</span><span style='color:#200080; font-weight:bold; '>item</span><span style='color:#308080; '>,</span> <span style='color:#007d45; '>index</span><span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#308080; '>(</span>
																<span style='color:#308080; '>&lt;</span>li
																	<span style='color:#406080; '>{</span><span style='color:#308080; '>.</span><span style='color:#308080; '>.</span><span style='color:#308080; '>.</span>getItemProps<span style='color:#308080; '>(</span><span style='color:#406080; '>{</span> <span style='color:#200080; font-weight:bold; '>item</span> <span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>}</span>
																	key<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>item</span><span style='color:#308080; '>.</span>label<span style='color:#406080; '>}</span>
																	style<span style='color:#308080; '>=</span><span style='color:#406080; '>{</span><span style='color:#406080; '>{</span>
																		backgroundColor<span style='color:#406080; '>:</span> highlightedIndex <span style='color:#308080; '>===</span> <span style='color:#007d45; '>index</span> <span style='color:#406080; '>?</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>#eee</span><span style='color:#800000; '>"</span> <span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>#fff</span><span style='color:#800000; '>"</span>
																	<span style='color:#406080; '>}</span><span style='color:#406080; '>}</span>
																<span style='color:#308080; '>></span>
																	<span style='color:#406080; '>{</span><span style='color:#200080; font-weight:bold; '>item</span><span style='color:#308080; '>.</span>label<span style='color:#406080; '>}</span>
																<span style='color:#308080; '>&lt;</span><span style='color:#308080; '>/</span>li<span style='color:#308080; '>></span>
															<span style='color:#308080; '>)</span><span style='color:#308080; '>)</span>
													<span style='color:#406080; '>}</span>
												<span style='color:#308080; '>&lt;</span><span style='color:#308080; '>/</span>ul<span style='color:#308080; '>></span>
											<span style='color:#308080; '>&lt;</span><span style='color:#308080; '>/</span>div<span style='color:#308080; '>></span><span style='color:#308080; '>)</span>
											<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>null</span>
									<span style='color:#406080; '>}</span>
								<span style='color:#308080; '>&lt;</span><span style='color:#308080; '>/</span>div<span style='color:#308080; '>></span>
							<span style='color:#308080; '>)</span><span style='color:#406080; '>}</span>
<span style='color:#1060b6; '>						</span><span style='color:#800000; '>/</span><span style='color:#1060b6; '>>)</span>
<span style='color:#1060b6; '>						: </span><span style='color:#308080; '>(</span><span style='color:#1060b6; '></span>
<span style='color:#1060b6; '>							&lt;Flex showBorder={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>showIcon} iconPosition={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>iconPosition}></span>
<span style='color:#1060b6; '>								&lt;Input</span>
<span style='color:#1060b6; '>									className={getClassName</span><span style='color:#308080; '>(</span><span style='color:#1060b6; '>this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>innerClass, "input"</span><span style='color:#308080; '>)</span><span style='color:#1060b6; '> </span><span style='color:#406080; '>|</span><span style='color:#406080; '>|</span><span style='color:#1060b6; '> null}</span>
<span style='color:#1060b6; '>									placeholder={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>placeholder}</span>
<span style='color:#1060b6; '>									value={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>state</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>currentValue </span><span style='color:#308080; '>?</span><span style='color:#1060b6; '> this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>state</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>currentValue : ""}</span>
<span style='color:#1060b6; '>									onChange={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>onInputChange}</span>
<span style='color:#1060b6; '>									onBlur={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>onBlur}</span>
<span style='color:#1060b6; '>									onFocus={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>onFocus}</span>
<span style='color:#1060b6; '>									onKeyPress={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>onKeyPress}</span>
<span style='color:#1060b6; '>									onKeyDown={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>onKeyDown}</span>
<span style='color:#1060b6; '>									onKeyUp={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>onKeyUp}</span>
<span style='color:#1060b6; '>									autoFocus={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>autoFocus}</span>
<span style='color:#1060b6; '>									showIcon={this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>props</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>showIcon}</span>
<span style='color:#1060b6; '>								/></span>
<span style='color:#1060b6; '>								{this</span><span style='color:#308080; '>.</span><span style='color:#1060b6; '>renderIcon</span><span style='color:#308080; '>(</span><span style='color:#308080; '>)</span><span style='color:#1060b6; '>}</span>
<span style='color:#1060b6; '>							&lt;/Flex></span>
<span style='color:#1060b6; '>						</span><span style='color:#308080; '>)</span><span style='color:#1060b6; '></span>
<span style='color:#1060b6; '>				}</span>
<span style='color:#1060b6; '>			&lt;</span><span style='color:#800000; '>/</span>div<span style='color:#308080; '>></span>
		<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
	<span style='color:#406080; '>}</span>
<span style='color:#ffffff; background:#dd9999; font-weight:bold; font-style:italic; '>}</span>

DataSearch<span style='color:#308080; '>.</span>propTypes <span style='color:#308080; '>=</span> <span style='color:#406080; '>{</span>
	componentId<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>stringRequired<span style='color:#308080; '>,</span>
	title<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>title<span style='color:#308080; '>,</span>
	addComponent<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>funcRequired<span style='color:#308080; '>,</span>
	highlight<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>bool<span style='color:#308080; '>,</span>
	setQueryOptions<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>funcRequired<span style='color:#308080; '>,</span>
	defaultSelected<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>string<span style='color:#308080; '>,</span>
	dataField<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>dataFieldArray<span style='color:#308080; '>,</span>
	highlightField<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>highlightField<span style='color:#308080; '>,</span>
	react<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>react<span style='color:#308080; '>,</span>
	suggestions<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>suggestions<span style='color:#308080; '>,</span>
	defaultSuggestions<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>suggestions<span style='color:#308080; '>,</span>
	removeComponent<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>funcRequired<span style='color:#308080; '>,</span>
	fieldWeights<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>fieldWeights<span style='color:#308080; '>,</span>
	queryFormat<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>queryFormatSearch<span style='color:#308080; '>,</span>
	fuzziness<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>fuzziness<span style='color:#308080; '>,</span>
	autoSuggest<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>bool<span style='color:#308080; '>,</span>
	beforeValueChange<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	onValueChange<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	customQuery<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	onQueryChange<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	onSuggestion<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	updateQuery<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>funcRequired<span style='color:#308080; '>,</span>
	placeholder<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>string<span style='color:#308080; '>,</span>
	onBlur<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	onFocus<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	onKeyPress<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	onKeyDown<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	onKeyUp<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>func<span style='color:#308080; '>,</span>
	autoFocus<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>bool<span style='color:#308080; '>,</span>
	selectedValue<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>selectedValue<span style='color:#308080; '>,</span>
	URLParams<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>boolRequired<span style='color:#308080; '>,</span>
	showFilter<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>bool<span style='color:#308080; '>,</span>
	filterLabel<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>string<span style='color:#308080; '>,</span>
	style<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>style<span style='color:#308080; '>,</span>
	className<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>string<span style='color:#308080; '>,</span>
	innerClass<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>style<span style='color:#308080; '>,</span>
	showIcon<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>bool<span style='color:#308080; '>,</span>
	iconPosition<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>iconPosition<span style='color:#308080; '>,</span>
	icon<span style='color:#406080; '>:</span> types<span style='color:#308080; '>.</span>children
<span style='color:#406080; '>}</span>

DataSearch<span style='color:#308080; '>.</span>defaultProps <span style='color:#308080; '>=</span> <span style='color:#406080; '>{</span>
	placeholder<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>Search</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
	autoSuggest<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>,</span>
	queryFormat<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>or</span><span style='color:#800000; '>"</span><span style='color:#308080; '>,</span>
	URLParams<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>false</span><span style='color:#308080; '>,</span>
	showFilter<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>,</span>
	style<span style='color:#406080; '>:</span> <span style='color:#406080; '>{</span><span style='color:#406080; '>}</span><span style='color:#308080; '>,</span>
	className<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>null</span><span style='color:#308080; '>,</span>
	showIcon<span style='color:#406080; '>:</span> <span style='color:#0f4d75; '>true</span><span style='color:#308080; '>,</span>
	iconPosition<span style='color:#406080; '>:</span> <span style='color:#800000; '>"</span><span style='color:#1060b6; '>right</span><span style='color:#800000; '>"</span>
<span style='color:#406080; '>}</span>

<span style='color:#200080; font-weight:bold; '>const</span> mapStateToProps <span style='color:#308080; '>=</span> <span style='color:#308080; '>(</span>state<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
	suggestions<span style='color:#406080; '>:</span> state<span style='color:#308080; '>.</span>hits<span style='color:#308080; '>[</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>]</span> <span style='color:#308080; '>&amp;&amp;</span> state<span style='color:#308080; '>.</span>hits<span style='color:#308080; '>[</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>]</span><span style='color:#308080; '>.</span>hits<span style='color:#308080; '>,</span>
	selectedValue<span style='color:#406080; '>:</span> state<span style='color:#308080; '>.</span>selectedValues<span style='color:#308080; '>[</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>]</span> <span style='color:#308080; '>&amp;&amp;</span> state<span style='color:#308080; '>.</span>selectedValues<span style='color:#308080; '>[</span>props<span style='color:#308080; '>.</span>componentId<span style='color:#308080; '>]</span><span style='color:#308080; '>.</span>value <span style='color:#308080; '>||</span> <span style='color:#0f4d75; '>null</span>
<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

<span style='color:#200080; font-weight:bold; '>const</span> mapDispatchtoProps <span style='color:#308080; '>=</span> dispatch <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> <span style='color:#308080; '>(</span><span style='color:#406080; '>{</span>
	addComponent<span style='color:#406080; '>:</span> component <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> dispatch<span style='color:#308080; '>(</span>addComponent<span style='color:#308080; '>(</span>component<span style='color:#308080; '>)</span><span style='color:#308080; '>)</span><span style='color:#308080; '>,</span>
	removeComponent<span style='color:#406080; '>:</span> component <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> dispatch<span style='color:#308080; '>(</span>removeComponent<span style='color:#308080; '>(</span>component<span style='color:#308080; '>)</span><span style='color:#308080; '>)</span><span style='color:#308080; '>,</span>
	watchComponent<span style='color:#406080; '>:</span> <span style='color:#308080; '>(</span>component<span style='color:#308080; '>,</span> react<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> dispatch<span style='color:#308080; '>(</span>watchComponent<span style='color:#308080; '>(</span>component<span style='color:#308080; '>,</span> react<span style='color:#308080; '>)</span><span style='color:#308080; '>)</span><span style='color:#308080; '>,</span>
	updateQuery<span style='color:#406080; '>:</span> updateQueryObject <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> dispatch<span style='color:#308080; '>(</span>
		updateQuery<span style='color:#308080; '>(</span>updateQueryObject<span style='color:#308080; '>)</span>
	<span style='color:#308080; '>)</span><span style='color:#308080; '>,</span>
	setQueryOptions<span style='color:#406080; '>:</span> <span style='color:#308080; '>(</span>component<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span> <span style='color:#308080; '>=</span><span style='color:#308080; '>></span> dispatch<span style='color:#308080; '>(</span>setQueryOptions<span style='color:#308080; '>(</span>component<span style='color:#308080; '>,</span> props<span style='color:#308080; '>)</span><span style='color:#308080; '>)</span>
<span style='color:#406080; '>}</span><span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>

<span style='color:#200080; font-weight:bold; '>export</span> <span style='color:#200080; font-weight:bold; '>default</span> connect<span style='color:#308080; '>(</span>mapStateToProps<span style='color:#308080; '>,</span> mapDispatchtoProps<span style='color:#308080; '>)</span><span style='color:#308080; '>(</span>DataSearch<span style='color:#308080; '>)</span><span style='color:#406080; '>;</span>
</pre>`;

export const mockDataSearch = `<div style="overflow:auto;width:auto;padding:1rem;"><pre style="margin: 0; line-height: 125%"><span style="color: #ce5c00; font-weight: bold">&lt;</span><span style="color: #000000">DataSearch</span>
	<span style="color: #000000">componentId</span><span style="color: #ce5c00; font-weight: bold">=</span><span style="color: #4e9a06">&quot;searchbox&quot;</span>
	<span style="color: #000000">dataField</span><span style="color: #ce5c00; font-weight: bold">=</span><span style="color: #000000; font-weight: bold">{[</span><span style="color: #4e9a06">&quot;name&quot;</span><span style="color: #000000; font-weight: bold">,</span> <span style="color: #4e9a06">&quot;tagline&quot;</span><span style="color: #000000; font-weight: bold">]}</span>
	<span style="color: #000000">placeholder</span><span style="color: #ce5c00; font-weight: bold">=</span><span style="color: #4e9a06">&quot;Discover products...&quot;</span>
<span style="color: #ce5c00; font-weight: bold">/&gt;</span>
</pre></div>
`;
