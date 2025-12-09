package id.puzikov.day2.task1


fun main() {
    val input = object {}.javaClass.getResourceAsStream("input.txt")!!.bufferedReader(Charsets.UTF_8).readLines()
    val res = input.flatMap { it.split(",") }
        .filter { it.isNotEmpty() }
        .map { it.split("-") }
        .map {
            LongRange(it[0].toLong(), it[1].toLong())
        }
        .flatten()
        .map { it.toString() }
        .filter { it.length % 2 == 0 && it.take(it.length / 2) == it.takeLast(it.length / 2) }
        .sumOf { it.toLong() }
    println(res)
}
