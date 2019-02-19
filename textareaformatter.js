function setProcessedTextareaValue(textareaObj, maxLength, maxRows, regexLine) {
    var value = textareaObj.value;
    var textareaStart = textareaObj.selectionStart;
    var lines = value.split('\n');

    var addedLinesLength = 0;
    var linesLength = lines.length < maxRows ? lines.length : maxRows;
    for (var i = 0; i < linesLength; i++) {
        var chunkStringsResult = textareaformatter_getChunkedString(lines[i], maxLength, maxRows, addedLinesLength, regexLine);
        var chunkedStrings = chunkStringsResult.result;
        textareaStart += chunkStringsResult.enterCount;
        lines.splice(i, 1);
        linesLength--;

        var j = 0;
        while (j < chunkedStrings.length) {
            lines.splice(i + j, 0, chunkedStrings[j]);
            addedLinesLength++;
            j++;
            linesLength++;
        }
        i += j - 1;
    }
    if (lines.length > maxRows) {
        lines.splice(maxRows, lines.length);
    }
    var result = lines.join('\r\n');
    textareaObj.value = result;
    textareaObj.selectionEnd = textareaStart;
}

function textareaformatter_getChunkedString(line, maxLength, maxRows, addedLinesLength, regexLine) {

    line = line.replace(/(\r\n|\n|\r)/gm, "");
    var lineRemainder = line;
    var result = [];

    var enterCount = 0;
    var endIndex = textareaformatter_getEndIndex(maxLength, lineRemainder.length);
    while (lineRemainder.length > maxLength) {
        if (addedLinesLength + 1 === maxRows) {
            lineRemainder = lineRemainder.substring(0, maxLength);
            break;
        }
        var oldEndIndex = endIndex;
        while (regexLine.test(lineRemainder[endIndex]) === true) {
            if (endIndex === 0) {
                endIndex = oldEndIndex;
                break;
            }
            endIndex--;
        }
        result.push(lineRemainder.substring(0, endIndex + 1));
        addedLinesLength++;
        enterCount++;

        lineRemainder = lineRemainder.substring(endIndex + 1, lineRemainder.length);
        endIndex = textareaformatter_getEndIndex(maxLength, lineRemainder.length);
    }
    result.push(lineRemainder);
    return { result: result, enterCount: enterCount };
}

function textareaformatter_getEndIndex(maxLength, lineRemainderLength) {
    return maxLength - 1 > lineRemainderLength - 1
        ? lineRemainderLength
        : maxLength - 1;
}