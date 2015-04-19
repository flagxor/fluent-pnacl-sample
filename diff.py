#!/usr/bin/python
# vim: ts=8 et sw=2 sts=0 mouse=

import difflib
import sys


def load_file(filename):
  return open(filename).read()


def save_file(data, filename):
  with open(filename, 'w') as fh:
    fh.write(data)


def generate_diff(data_before, data_after, filename_before, filename_after):
  return difflib.HtmlDiff().make_file(
      data_before.splitlines(), data_after.splitlines(),
      filename_before, filename_after)


def main():
  if len(sys.argv) != 4:
    sys.stderr.write('USAGE: diff.py <before> <after> <diff-out>\n')
    sys.exit(1)

  filename_before = sys.argv[1]
  filename_after = sys.argv[2]
  filename_diff = sys.argv[3]

  while True:
    x = raw_input()
    data_before = load_file(filename_before)
    data_after = load_file(filename_after)

    diff = generate_diff(data_before, data_after,
                         filename_before, filename_after)

    save_file(diff, filename_diff)
    print ''


if __name__ == '__main__':
  main()
