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
								<span style='color:#308080; '>&lt;</span><span style='color:#308080; '>/</span>div<span style='color:#308080; '>></span>
							<span style='color:#308080; '>)</span><span style='color:#406080; '>}</span>
<span style='color:#1060b6; '>`;

export const mockDataSearch = `<div style="overflow:auto;width:auto;"><pre style="margin: 0; line-height: 125%"><span style="color: #ce5c00; font-weight: bold">&lt;</span><span style="color: #000000">DataSearch</span>
	<span style="color: #000000">componentId</span><span style="color: #ce5c00; font-weight: bold">=</span><span style="color: #4e9a06">&quot;searchbox&quot;</span>
	<span style="color: #000000">dataField</span><span style="color: #ce5c00; font-weight: bold">=</span><span style="color: #000000; font-weight: bold">{[</span><span style="color: #4e9a06">&quot;name&quot;</span><span style="color: #000000; font-weight: bold">,</span> <span style="color: #4e9a06">&quot;tagline&quot;</span><span style="color: #000000; font-weight: bold">]}</span>
	<span style="color: #000000">placeholder</span><span style="color: #ce5c00; font-weight: bold">=</span><span style="color: #4e9a06">&quot;Discover products...&quot;</span>
	<span style="color: #000000">title</span><span style="color: #ce5c00; font-weight: bold">=</span><span style="color: #4e9a06">&quot;Search products&quot;</span>
	<span style="color: #000000">react</span><span style="color: #ce5c00; font-weight: bold">=</span><span style="color: #000000; font-weight: bold">{{</span>
		<span style="color: #000000">and</span><span style="color: #ce5c00; font-weight: bold">:</span> <span style="color: #4e9a06">&quot;Filters&quot;</span>
	<span style="color: #000000; font-weight: bold">}}</span>
<span style="color: #ce5c00; font-weight: bold">/&gt;</span>
</pre></div>

`;
