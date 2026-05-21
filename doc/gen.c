
//----------------------------------------------------------
// Comment format
//
// side :: Element a -> Element b -> Element a
// Explicity defines a side-effect and returns the argument.
//----------------------------------------------------------

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <stdbool.h>

#define shift(argv) *argv++

#define LINE_SIZE 256

typedef struct {
	char *ptr;
	size_t size;
} StringView;

void svprintln(StringView sv) {
	printf("StringBuilder(\"%.*s\", %lld)\n", (int) sv.size, sv.ptr, sv.size);
}

bool svsubstring(StringView sv, const char *sub, StringView *out) {
	size_t idx1 = 0;
	size_t idx2 = 0;
	int start = -1;
	while (idx1 < sv.size && sub[idx2] != '\0') {
		if (sv.ptr[idx1] != sub[idx2]) {
			start = -1;
			idx2 = 0;
			idx1++;
			continue;
		}
		if (start == -1) {
			start = idx1;
		}
		idx1++;
		idx2++;
		if (sub[idx2] == '\0') {
			out->ptr = &sv.ptr[start];
			out->size = strlen(sub);
			return true;
		}
	}
	return false;
}

StringView svtrimleft(StringView sv) {
	if (sv.size == 0) return sv;
	StringView out = {sv.ptr, sv.size};
	while (isspace(out.ptr[0])) {
		out.ptr++;
		out.size--;
	}
	return out;
}

StringView svtrimright(StringView sv) {
	if (sv.size == 0) return sv;
	StringView out = {sv.ptr, sv.size};
	while (isspace(out.ptr[out.size - 1])) {
		out.size--;
	}
	return out;
}

StringView svtrimleftch(StringView sv, char ch) {
	StringView out = {sv.ptr, sv.size};
	while (out.ptr[0] == ch) {
		out.ptr++;
		out.size--;
		assert(out.size >= 0);
	}
	return out;
}

typedef struct {
	char *ptr;
	size_t size;
	size_t capacity;
} StringBuilder;

StringBuilder sbnew() {
	StringBuilder sb;
	sb.ptr = malloc(sizeof(char) * 256);
	sb.size = 0;
	sb.capacity = 256;
	return sb;
}

void sbrealloc(StringBuilder *sb) {
	sb->capacity *= 2;
	sb->ptr = realloc(sb->ptr, sb->capacity);
}

void sbfree(StringBuilder *sb) {
	free(sb->ptr);
}

void sbpush(StringBuilder *sb, char *s) {
	size_t n = strlen(s);
	if (sb->size + n >= sb->capacity) {
		sbrealloc(sb);
	}
	memcpy(&sb->ptr[sb->size], s, n);
	sb->size += n;
}

void sbpushn(StringBuilder *sb, char *s, size_t n) {
	if (sb->size + n >= sb->capacity) {
		sbrealloc(sb);
	}
	memcpy(&sb->ptr[sb->size], s, n);
	sb->size += n;
}

void sbpushsv(StringBuilder *sb, StringView sv) {
	if (sb->size + sv.size >= sb->capacity) {
		sbrealloc(sb);
	}
	memcpy(&sb->ptr[sb->size], sv.ptr, sv.size);
	sb->size += sv.size;
}

int readline(char *dest, size_t destsize, FILE *file) {
	memset(dest, 0, destsize);
	char ch = 0;
	size_t index = 0;
	while (true) {
		ch = fgetc(file);
		if (ch == EOF) return -1;
		if (ch == '\n') return index;
		if (ch == '\r') continue;
		dest[index++] = ch;
	}
	assert(false && "unreachable");
}
typedef void (*ReadLineCallback)(StringView);

void freadlines(FILE *file, ReadLineCallback callback) {
	char line[LINE_SIZE];
	while (true) {
		size_t readed = readline((char *) line, LINE_SIZE, file);
		if (readed == -1) break;
		StringView sv = {
			.ptr = line,
			.size = readed,
		};
		callback(sv);
	}
}

StringBuilder sb;

void readsingleline(StringView sv) {
	StringView id;
	if (!svsubstring(sv, "//", &id)) return;
	if (!svsubstring(sv, "::", &id)) return;

	StringView name = {
		.ptr = sv.ptr,
		.size = id.ptr - sv.ptr
	};
	name = svtrimleftch(name, '/');
	name = svtrimleft(name);
	name = svtrimright(name);
	if (name.size == 0) {
		name.ptr = "?";
		name.size = 1;
	}

	StringView signature = {
		.ptr = id.ptr + id.size,
		.size = (sv.ptr + sv.size) - (id.ptr + id.size)
	};
	signature = svtrimleft(signature);

	sbpush(&sb, "  <p id=\"");
	sbpushsv(&sb, name);
	sbpush(&sb, "\" class=\"signature\">");
	sbpush(&sb, "<a href=\"#");
	sbpushsv(&sb, name);
	sbpush(&sb, "\">");
	sbpushsv(&sb, name);
	sbpush(&sb, "</a> :: ");
	sbpushsv(&sb, signature);
	sbpush(&sb, "</p>\n");
}

int main(int argc, char **argv) {
	char *program = shift(argv);
	char *filepath = shift(argv);
	if (!filepath) {
		fprintf(stderr, "ERROR: missing file path argument");
		return -1;
	}

	sb = sbnew();
	sbpush(&sb, "<html>\n");
	sbpush(&sb, "  <head>\n");
	sbpush(&sb,
		"    <style>\n"
		"    * {\n"
		"      font-family: monospace;\n"
		"    }\n"
		"    .signature {\n"
		"      color: \"white\";\n"
		"      background: lightblue;\n"
		"      padding: 0.5rem;\n"
		"      border-radius: 0.25rem;\n"
		"    }\n"
		"    </style>\n");
	sbpush(&sb, "  </head>\n");
	sbpush(&sb, "<body>\n");
	sbpush(&sb, "  <h1>");
	sbpushn(&sb, filepath, strlen(filepath));
	sbpush(&sb, "</h1>\n");

	FILE *file = fopen(filepath, "r");
	freadlines(file, readsingleline);

	sbpush(&sb, "  </body>\n");
	sbpush(&sb, "</html>\n");
	printf("%.*s\n", (int) sb.size, sb.ptr);

	sbfree(&sb);
	fclose(file);
	return 0;
}

