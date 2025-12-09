package id.puzikov.day2.task2


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
        .filter { checkValid(it) }
        .sumOf { it.toLong() }
    println(res)
}

fun checkValid(seq: String): Boolean {
    //println("checking $seq")
    for (i in 1 .. seq.length / 2) {
        val pattern = seq.take(i)
        val remaining = seq.drop(i)
        val valid = checkPattern(pattern, remaining)

        if (valid){
            println("$pattern for $remaining -> ${true}")
            return true
        }
    }
    return false
}

fun checkPattern(pattern: String, remaining: String): Boolean {
    if (remaining.length % pattern.length != 0) return false
    val groups = remaining.chunked(pattern.length)
    return groups.all { it == pattern }
}
